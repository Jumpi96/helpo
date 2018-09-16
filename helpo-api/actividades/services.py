from actividades.models import Evento, Necesidad, Colaboracion, Voluntario, Participacion, LogMensaje, Mensaje, Propuesta
from common.notifications import send_mail_to_list, send_mail_to
from common.templates import render_mensaje_evento, render_full_participacion_email
from users.models import User


def send_mail_mensaje_evento(mensaje, evento_id):
    participantes = get_participantes_evento(evento_id)
    email_participantes = [p.email for p in participantes]
    evento = Evento.objects.filter(id=evento_id).first()
    email_participantes.append(evento.organizacion.email)
    send_mail_to_list(email_participantes,
                      "helpo - " + mensaje.asunto + " (" + evento.nombre + ")",
                      render_mensaje_evento(evento, mensaje.mensaje)
                      )
    for participante in participantes:
        LogMensaje.objects.create(
            colaborador_id=participante.id, mensaje_id=mensaje.id)


def get_participantes_evento(evento_id):
    participantes = []
    necesidades = Necesidad.objects.filter(evento_id=evento_id)
    for necesidad in necesidades:
        colaboraciones = Colaboracion.objects.filter(
            necesidad_material_id=necesidad.id)
        for colaboracion in colaboraciones:
            if colaboracion.colaborador_id not in participantes:
                participantes.append(colaboracion.colaborador_id)
    voluntarios = Voluntario.objects.filter(evento_id=evento_id)
    for voluntario in voluntarios:
        participaciones = Participacion.objects.filter(
            necesidad_voluntario_id=voluntario.id)
        for participacion in participaciones:
            if participacion.colaborador_id not in participantes:
                participantes.append(participacion.colaborador_id)
    return User.objects.filter(id__in=participantes)


def send_previous_mail_evento(evento_id, colaborador_id):
    mensajes = Mensaje.objects.filter(evento_id=evento_id)
    evento = Evento.objects.filter(id=evento_id).first()
    colaborador_email = User.objects.filter(id=colaborador_id).first().email
    for mensaje in mensajes:
        if len(LogMensaje.objects.filter(mensaje_id=mensaje.id, usuario_id=colaborador_id)) == 0:
            send_mail_to(colaborador_email,
                         "helpo - " + mensaje.asunto +
                         " (" + evento.nombre + ")",
                         render_mensaje_evento(evento, mensaje.mensaje)
                         )
            LogMensaje.objects.create(
                usuario_id=colaborador_id, mensaje_id=mensaje.id)


def send_full_participacion_mail(necesidad_voluntario):
    organizacion_email = necesidad_voluntario.evento.organizacion.email
    send_mail_to(organizacion_email, "Necesidad cubierta en Helpo",
                 render_full_participacion_email(necesidad_voluntario))


def notificar_cambio_evento(request_data):
    usuarios_id = _get_usuarios(request_data)
    evento = _get_evento(request_data)
    _send_mail(usuarios_id, evento)
    _send_push(usuarios_id, evento)


def _send_push(usuarios_id, evento):
    en_msg = "The event " + evento.nombre + " has changed"
    es_msg = "El evento " + evento.nombre + " ha sido modificado"
    from common.notifications import send_push_notification_to_id_list
    send_push_notification_to_id_list(
        usuarios_id, "Event changed", "Cambio en Evento", en_msg, es_msg)


def _send_mail(usuarios_id, evento):
    subject_utf = u"Modificación en el evento: " + evento.nombre
    from common.templates import render_cambio_evento_email
    content = render_cambio_evento_email(evento)
    from common.notifications import send_mail_to_id_list
    send_mail_to_id_list(ids_to=usuarios_id,
                         html_subject=subject_utf, html_content=content)


def _get_usuarios(evento):
    from actividades.models import Necesidad, Voluntario, Colaboracion, Participacion
    necesidades = Necesidad.objects.filter(evento=evento['id']).values('id')
    voluntarios = Voluntario.objects.filter(evento=evento['id']).values('id')
    colaboraciones = Colaboracion.objects.filter(
        necesidad_material__in=necesidades).values('colaborador')
    participaciones = Participacion.objects.filter(
        necesidad_voluntario__in=voluntarios).values('colaborador')
    usuarios_1 = [colaboracion['colaborador']
                  for colaboracion in colaboraciones]
    usuarios_2 = [participacion['colaborador']
                  for participacion in participaciones]
    return usuarios_1 + usuarios_2


def _get_evento(evento):
    from actividades.models import Evento
    return Evento.objects.get(id=evento['id'])


def send_participacion_create_email(participacion):
    titulo_email = u"Usted se ha registrado para participar como " \
        + participacion.necesidad_voluntario.funcion.nombre + " en el siguiente evento:"
    _send_participacion_email(participacion, titulo_email)


def send_participacion_destroy_email(participacion):
    titulo_email = u"Usted ha cancelado su participación como " \
        + participacion.necesidad_voluntario.funcion.nombre + " en el siguiente evento:"
    _send_participacion_email(participacion, titulo_email)


def _send_participacion_email(participacion, titulo_email):
    subject_utf = u"Registro de su participación en Helpo"
    from common.templates import render_participacion_email
    content = render_participacion_email(participacion, titulo_email)
    colaborador_mail = participacion.colaborador.email
    from common.notifications import send_mail_to
    send_mail_to(colaborador_mail,
                 html_subject=subject_utf, html_content=content)


def create_propuesta_voluntario(user, necesidad_voluntario):
    evento_id = Voluntario.objects.get(id=necesidad_voluntario).evento_id
    if len(Propuesta.objects.filter(evento_id=evento_id).filter(empresa_id=user.id)) == 0:
        Propuesta.objects.create(
            evento_id=evento_id, empresa_id=user.id, aceptado=0)


def create_propuesta_necesidad(user, necesidad_material):
    evento_id = Necesidad.objects.get(id=necesidad_material).evento_id
    if len(Propuesta.objects.filter(evento_id=evento_id).filter(empresa_id=user.id)) == 0:
        Propuesta.objects.create(
            evento_id=evento_id, empresa_id=user.id, aceptado=0)
