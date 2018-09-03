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
        LogMensaje.objects.create(voluntario_id=participante.id, mensaje_id=mensaje.id)
    
    
def get_participantes_evento(evento_id):
    participantes = []
    necesidades = Necesidad.objects.filter(evento_id=evento_id)
    for necesidad in necesidades:
        colaboraciones = Colaboracion.objects.filter(necesidad_material_id=necesidad.id)
        for colaboracion in colaboraciones:
            if colaboracion.voluntario_id not in participantes:
                participantes.append(colaboracion.voluntario_id)
    voluntarios = Voluntario.objects.filter(evento_id=evento_id)
    for voluntario in voluntarios:
        participaciones = Participacion.objects.filter(necesidad_voluntario_id=voluntario.id)
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
                "helpo - " + mensaje.asunto + " (" + evento.nombre + ")",
                render_mensaje_evento(evento, mensaje.mensaje)
            )
            LogMensaje.objects.create(voluntario_id=voluntario_id, mensaje_id=mensaje.id)