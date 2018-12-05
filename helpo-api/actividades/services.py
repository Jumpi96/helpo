from collections import namedtuple
from django.db.models import Sum
from actividades.models import Evento, Necesidad, Colaboracion, Voluntario, Participacion, LogMensaje, Mensaje, Propuesta, Presencia, Entrega
from common.notifications import send_mail_to_list, send_mail_to, send_mail_to_id_list, send_mail_to_id, send_push_notification_to_id_list
from common.templates import render_participacion_email, render_cambio_evento_email, render_mensaje_evento, render_full_participacion_email, render_full_colaboracion_email, render_was_full_colaboracion_email, render_was_full_participacion_email, render_inicio_evento_email, render_fin_evento_email, render_creacion_evento_email, render_propuesta
from users.models import User, Suscripcion


def send_mail_mensaje_evento(mensaje, evento_id):
    participantes = get_participantes_evento(evento_id)
    email_participantes = [p.email for p in participantes]
    evento = Evento.objects.filter(id=evento_id).first()
    email_participantes.append(evento.organizacion.email)
    send_mail_to_list(email_participantes,
                      "Helpo: " + mensaje.asunto + " (" + evento.nombre + ")",
                      render_mensaje_evento(evento, mensaje.mensaje)
                      )
    for participante in participantes:
        LogMensaje.objects.create(
            usuario_id=participante.id, mensaje_id=mensaje.id)

def get_participantes_evento(evento_id):
    participantes = []
    necesidades = Necesidad.objects.filter(evento_id=evento_id)
    for necesidad in necesidades:
        colaboraciones = Colaboracion.objects.filter(
            necesidad_material_id=necesidad.id, vigente=True
        )
        for colaboracion in colaboraciones:
            if colaboracion.colaborador_id not in participantes:
                participantes.append(colaboracion.colaborador_id)
    voluntarios = Voluntario.objects.filter(evento_id=evento_id)
    for voluntario in voluntarios:
        participaciones = Participacion.objects.filter(
            necesidad_voluntario_id=voluntario.id, vigente=True
        )
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
                         "Helpo: " + mensaje.asunto +
                         " (" + evento.nombre + ")",
                         render_mensaje_evento(evento, mensaje.mensaje)
                         )
            LogMensaje.objects.create(
                usuario_id=colaborador_id, mensaje_id=mensaje.id)


def send_full_participacion_mail(necesidad_voluntario):
    organizacion_email = necesidad_voluntario.evento.organizacion.email
    send_mail_to(organizacion_email, "Necesidad cubierta en Helpo",
                 render_full_participacion_email(necesidad_voluntario))


def send_was_full_participacion_mail(necesidad_voluntario):
    organizacion_email = necesidad_voluntario.evento.organizacion.email
    send_mail_to(organizacion_email, "Necesidad pendiente en Helpo",
                 render_was_full_participacion_email(necesidad_voluntario))


def send_full_colaboracion_mail(necesidad_material):
    organizacion_email = necesidad_material.evento.organizacion.email
    send_mail_to(organizacion_email, "Necesidad cubierta en Helpo",
                 render_full_colaboracion_email(necesidad_material))


def send_was_full_colaboracion_mail(necesidad_material):
    organizacion_email = necesidad_material.evento.organizacion.email
    send_mail_to(organizacion_email, "Necesidad pendiente en Helpo",
                 render_was_full_colaboracion_email(necesidad_material))


def send_mail_creacion_evento(evento):
    """
    Manda mail de creacion de evento a todos los suscritos a la ong    
    """
    from users.models import Suscripcion
    suscripciones = Suscripcion.objects.filter(organizacion=evento.organizacion)
    usuarios_id = [suscripcion.usuario.id for suscripcion in suscripciones]

    subject_utf = u"Creación de evento: " + evento.nombre
    content = render_creacion_evento_email(evento)
    send_mail_to_id_list(ids_to=usuarios_id,
                         html_subject=subject_utf, html_content=content)


def notificar_cambio_evento(request_data):
    evento = _get_evento(request_data)
    if evento is not None:
        usuarios_id = _get_usuarios(evento)
        _send_mail(usuarios_id, evento)
        _send_push(usuarios_id, evento)


def _send_push(usuarios_id, evento):
    en_msg = "The campaign " + evento.nombre + " has changed" if evento.campaña else "The event " + evento.nombre + " has changed"
    es_msg = "La campaña " + evento.nombre + " ha sido modificada" if evento.campaña else "El evento " + evento.nombre + " ha sido modificado" 
    send_push_notification_to_id_list(
        usuarios_id, "Activity changed", "Cambio en actividad social", en_msg, es_msg)


def _send_mail(usuarios_id, evento):
    subject_utf = u"Modificación en la actividad social: " + evento.nombre
    content = render_cambio_evento_email(evento)
    send_mail_to_id_list(ids_to=usuarios_id,
                         html_subject=subject_utf, html_content=content)


def _get_usuarios(evento):
    suscripciones = Suscripcion.objects.filter(organizacion=evento.organizacion).extra(
        select={'colaborador': 'usuario_id'}).values('colaborador')
    colaboraciones = Colaboracion.objects.filter(
        necesidad_material__evento_id=evento.id, vigente=True).values('colaborador')
    participaciones = Participacion.objects.filter(
        necesidad_voluntario__evento_id=evento.id, vigente=True).values('colaborador')
    usuarios = suscripciones.union(colaboraciones, participaciones)
    usuarios_id = [usuario['colaborador']
                  for usuario in usuarios]
    return usuarios_id


def _get_evento(evento):
    try:
        evento_obj = Evento.objects.get(id=evento['id'])
        return evento_obj
    except ObjectDoesNotExist:
        return None


def send_participacion_create_email(participacion):
    titulo_email = u"Usted se ha registrado para participar como " \
        + participacion.necesidad_voluntario.funcion.nombre + " en la siguiente actividad social:"
    _send_participacion_email(participacion, titulo_email)


def send_participacion_destroy_email(participacion):
    titulo_email = u"Usted ha cancelado su participación como " \
        + participacion.necesidad_voluntario.funcion.nombre + " en la siguiente actividad social:"
    _send_participacion_email(participacion, titulo_email)


def _send_participacion_email(participacion, titulo_email):
    subject_utf = u"Registro de su participación en Helpo"
    content = render_participacion_email(participacion, titulo_email)
    colaborador_mail = participacion.colaborador.email
    send_mail_to(colaborador_mail,
                 html_subject=subject_utf, html_content=content)


def create_propuesta_voluntario(user, necesidad_voluntario):
    evento_id = Voluntario.objects.get(id=necesidad_voluntario).evento_id
    if len(Propuesta.objects.filter(evento_id=evento_id, empresa_id=user.id)) == 0:
        Propuesta.objects.create(
            evento_id=evento_id, empresa_id=user.id, aceptado=0)

def _send_mail_propuesta(organizacion_id, empresa_id, propuesta):
    tipo_actividad = "campaña" if propuesta.evento.campaña else "evento"
    subject_utf = u"Propuesta para " + tipo_actividad + ": " + propuesta.evento.nombre
    content_organizacion = render_propuesta("recibido", propuesta)
    content_empresa = render_propuesta("efectuado", propuesta)
    send_mail_to_id(id_to=organizacion_id,
                    html_subject=subject_utf, html_content=content_organizacion)
    send_mail_to_id(id_to=empresa_id,
                    html_subject=subject_utf, html_content=content_empresa)

def _send_push_propuesta(usuarios_id, propuesta):
    en_msg = "The campaign " + propuesta.evento.nombre + " has a new proposal" if propuesta.evento.campaña else "The event " + propuesta.evento.nombre + " has a new proposal"
    es_msg = "La campaña " + propuesta.evento.nombre + " tiene una nueva propuesta" if propuesta.evento.campaña else "El evento " + propuesta.evento.nombre + " tiene una nueva propuesta"
    from common.notifications import send_push_notification_to_id_list
    send_push_notification_to_id_list(
        usuarios_id, "New proposal", "Nueva propuesta", en_msg, es_msg)

def _send_nueva_propuesta(propuesta):
    try:
        _send_mail_propuesta(propuesta.evento.organizacion.id, propuesta.empresa.id, propuesta)
        _send_push_propuesta([propuesta.evento.organizacion.id], propuesta)
    except:
        pass

def create_propuesta(user, necesidad, es_voluntario):
    if es_voluntario:
        evento_id = Voluntario.objects.get(id=necesidad).evento_id
        clean_propuesta(user.id, evento_id, True, necesidad)
    else:
        evento_id = Necesidad.objects.get(id=necesidad).evento_id
        clean_propuesta(user.id, evento_id, False, necesidad)
    if len(Propuesta.objects.filter(evento_id=evento_id, empresa_id=user.id)) == 0:
        propuesta = Propuesta.objects.create(
            evento_id=evento_id, empresa_id=user.id, aceptado=0)
        _send_nueva_propuesta(propuesta)

def clean_propuesta(empresa_id, evento_id, es_voluntario, necesidad_id):
    propuestas = Propuesta.objects.filter(empresa_id=empresa_id, evento_id=evento_id)
    if len(propuestas) > 0:
        propuesta = propuestas[0]
        if es_voluntario:
            cantidad_participaciones = len(Participacion.objects.filter(necesidad_voluntario__evento=propuesta.evento, colaborador_id=empresa_id).exclude(necesidad_voluntario_id=necesidad_id))
            cantidad_colaboraciones = len(Colaboracion.objects.filter(necesidad_material__evento=propuesta.evento, colaborador_id=empresa_id))
        else:
            cantidad_colaboraciones = len(Colaboracion.objects.filter(necesidad_material__evento=propuesta.evento, colaborador_id=empresa_id).exclude(necesidad_material_id=necesidad_id))
            cantidad_participaciones = len(Participacion.objects.filter(necesidad_voluntario__evento=propuesta.evento, colaborador_id=empresa_id))
        if cantidad_colaboraciones + cantidad_participaciones == 0:
            propuesta.delete()

def _send_mail_response_propuesta(usuarios_id, propuesta):
    subject_utf = u"Respuesta a tu propuesta para actividad social: " + propuesta.evento.nombre
    from common.templates import render_respuesta_propuesta
    content = render_respuesta_propuesta(propuesta)
    from common.notifications import send_mail_to_id_list
    send_mail_to_id_list(ids_to=usuarios_id,
                         html_subject=subject_utf, html_content=content)

def _send_push_response_propuesta(usuarios_id, propuesta):
    en_msg = "The organization answered your proposal to " + propuesta.evento.nombre
    es_msg = "La organización respondió a tu propuesta para " + propuesta.evento.nombre
    from common.notifications import send_push_notification_to_id_list
    send_push_notification_to_id_list(
        usuarios_id, "Proposal answer", "Respuesta a su propuesta", en_msg, es_msg)

def response_propuesta(propuesta):
    try:
        _send_mail_response_propuesta([propuesta.empresa.id], propuesta)
        _send_push_response_propuesta([propuesta.empresa.id], propuesta)
    except:
        pass


def deny_propuesta(propuesta):
    colaboraciones = Colaboracion.objects.filter(
        necesidad_material__evento_id=propuesta.evento.id).filter(
            colaborador_id=propuesta.empresa.id)
    for c in colaboraciones:
        c.vigente = False
        c.save()
    participaciones = Participacion.objects.filter(
        necesidad_voluntario__evento_id=propuesta.evento.id).filter(
            colaborador_id=propuesta.empresa.id)
    for p in participaciones:
        p.vigente = False
        p.save()


def notify_cambio_propuesta(propuesta):
    subject_utf = u"Cambio de una propuesta en Helpo"
    from common.templates import render_cambio_propuesta
    content = render_cambio_propuesta(propuesta)
    from common.notifications import send_mail_to_id, send_push_notification_to_id_list
    send_mail_to_id(id_to=propuesta.evento.organizacion.id,
                    html_subject=subject_utf, html_content=content)
    en_msg = "Proposal to " + propuesta.evento.nombre + " has been changed"
    es_msg = "La propuesta a " + propuesta.evento.nombre + " ha sido modificada"
    send_push_notification_to_id_list(
        [propuesta.evento.organizacion.id], "Proposal changed", "Cambio en una propuesta", en_msg, es_msg)


def notificar_inicio_evento(evento, cron_exec=False):
    colaboradores_id = _get_usuarios(evento)
    organizacion_id = evento.organizacion.id
    __send_inicio_mail(colaboradores_id, organizacion_id, evento, cron_exec)
    __send_inicio_push(colaboradores_id, organizacion_id, evento, cron_exec)


def __send_inicio_mail(colaboradores_id, organizacion_id, evento, cron_exec):
    colaboradores_id.append(organizacion_id)
    tipo_actividad = "la campaña " if evento.campaña else "el evento "
    subject_utf = u"Helpo: " + tipo_actividad + evento.nombre + " ha comenzado"
    send_mail_to_id_list(colaboradores_id, subject_utf,
                         render_inicio_evento_email(evento), thread_daemon=not cron_exec)


def __send_inicio_push(colaboradores_id, organizacion_id, evento, cron_exec):
    colaboradores_id.append(organizacion_id)
    en_msg = "The campaign " + evento.nombre + " has started" if evento.campaña else "The event " + evento.nombre + " has started"
    es_msg = "La campaña " + evento.nombre + " ha comenzado" if evento.campaña else "El evento " + evento.nombre + " ha comenzado"
    send_push_notification_to_id_list(
        colaboradores_id, "Activity started", "Inicio de actividad social", en_msg, es_msg, thread_daemon=not cron_exec)


def notificar_fin_evento(evento, cron_exec=False):
    colaboradores_id = _get_usuarios(evento)
    organizacion_id = evento.organizacion.id
    __send_fin_mail(colaboradores_id, organizacion_id, evento, cron_exec)
    __send_fin_push(colaboradores_id, organizacion_id, evento, cron_exec)


def __send_fin_mail(colaboradores_id, organizacion_id, evento, cron_exec):
    colaboradores_id.append(organizacion_id)
    subject_utf = u"Helpo: la actividad " + evento.nombre + " ha finalizado"
    send_mail_to_id_list(colaboradores_id, subject_utf,
                         render_fin_evento_email(evento), thread_daemon=not cron_exec)


def __send_fin_push(colaboradores_id, organizacion_id, evento, cron_exec):
    colaboradores_id.append(organizacion_id)
    en_msg = "The campaign " + evento.nombre + " has finished" if evento.campaña else "The event " + evento.nombre + " has finished"
    es_msg = "La campaña " + evento.nombre + " ha finalizado" if evento.campaña else "El evento " + evento.nombre + " ha finalizado"
    send_push_notification_to_id_list(
        colaboradores_id, "Activity finished", "Actividad social finalizada", en_msg, es_msg, thread_daemon=not cron_exec)

def actualizar_participacion(participacion_id, participo):
    participacion = Participacion.objects.get(id=participacion_id)
    presencias = Presencia.objects.filter(participacion=participacion)
    if presencias:
        cantidad_presencias = presencias.aggregate(Sum('cantidad'))['cantidad__sum']
    else:
        cantidad_presencias = 0
    if participo:
        if cantidad_presencias < participacion.cantidad:
            Presencia.objects.create(participacion_id=participacion.id, cantidad=participacion.cantidad-cantidad_presencias)
    else:
        if cantidad_presencias == participacion.cantidad:
            ultima_presencia = presencias.order_by('-created')[0]
            ultima_presencia.delete()

def actualizar_colaboracion(colaboracion_id, entregado):
    colaboracion = Colaboracion.objects.get(id=colaboracion_id)
    entregas = Entrega.objects.filter(colaboracion=colaboracion)
    if entregas:
        cantidad_entregas = entregas.aggregate(Sum('cantidad'))['cantidad__sum']
    else:
        cantidad_entregas = 0
    if entregado:
        if cantidad_entregas < colaboracion.cantidad:
            Entrega.objects.create(colaboracion_id=colaboracion.id, cantidad=colaboracion.cantidad-cantidad_entregas)
    else:
        if cantidad_entregas == colaboracion.cantidad:
            ultima_entrega = entregas.order_by('-created')[0]
            ultima_entrega.delete()