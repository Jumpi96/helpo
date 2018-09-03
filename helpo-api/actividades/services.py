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
