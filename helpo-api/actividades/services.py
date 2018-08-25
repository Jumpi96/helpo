from actividades.models import Evento, Necesidad, Colaboracion, Voluntario, Participacion, LogMensaje, Mensaje
from common.notifications import send_mail_to_list, send_mail_to
from common.templates import render_mensaje_evento
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
            voluntario_id=participante.id, mensaje_id=mensaje.id)


def get_participantes_evento(evento_id):
    participantes = []
    necesidades = Necesidad.objects.filter(evento_id=evento_id)
    for necesidad in necesidades:
        colaboraciones = Colaboracion.objects.filter(
            necesidad_material_id=necesidad.id)
        for colaboracion in colaboraciones:
            if colaboracion.voluntario_id not in participantes:
                participantes.append(colaboracion.voluntario_id)
    voluntarios = Voluntario.objects.filter(evento_id=evento_id)
    for voluntario in voluntarios:
        participaciones = Participacion.objects.filter(
            necesidad_voluntario_id=voluntario.id)
        for participacion in participaciones:
            if participacion.voluntario_id not in participantes:
                participantes.append(participacion.voluntario_id)
    return User.objects.filter(id__in=participantes)


def send_previous_mail_evento(evento_id, voluntario_id):
    mensajes = Mensaje.objects.filter(evento_id=evento_id)
    evento = Evento.objects.filter(id=evento_id).first()
    voluntario_email = User.objects.filter(id=voluntario_id).first().email
    for mensaje in mensajes:
        if len(LogMensaje.objects.filter(mensaje_id=mensaje.id, voluntario_id=voluntario_id)) == 0:
            send_mail_to(voluntario_email,
                         "helpo - " + mensaje.asunto +
                         " (" + evento.nombre + ")",
                         render_mensaje_evento(evento, mensaje.mensaje)
                         )
            LogMensaje.objects.create(
                voluntario_id=voluntario_id, mensaje_id=mensaje.id)


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
        necesidad_material__in=necesidades).values('voluntario')
    participaciones = Participacion.objects.filter(
        necesidad_voluntario__in=voluntarios).values('voluntario')
    usuarios_1 = [colaboracion['voluntario']
                  for colaboracion in colaboraciones]
    usuarios_2 = [participacion['voluntario']
                  for participacion in participaciones]
    return usuarios_1 + usuarios_2


def _get_evento(evento):
    from actividades.models import Evento
    return Evento.objects.get(id=evento['id'])