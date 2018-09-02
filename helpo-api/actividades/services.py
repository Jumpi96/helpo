from actividades.models import Necesidad, Colaboracion, Voluntario, Participacion
from users.models import User

def send_mail_mensaje_evento(mensaje, evento_id):
    participantes = get_participantes_evento(evento_id)
    for participante in participantes:
        envio_mensaje = LogMensaje.objects.create(voluntario_id=participante.id, mensaje_id=mensaje.id)
        print(participante.email)
    
    
def get_participantes_evento(evento_id):
    participantes = []
    necesidades = Necesidad.objects.filter(evento_id=evento_id)
    for necesidad in necesidades:
        colaboraciones = Colaboracion.objects.filter(necesidad_id=necesidad.id)
        for colaboracion in colaboraciones:
            if colaboracion.voluntario_id not in participantes:
                participantes.append(colaboracion.voluntario_id)
    voluntarios = Voluntario.objects.filter(evento_id=evento_id)
    for voluntario in voluntarios:
        participaciones = Participacion.objects.filter(voluntario_id=voluntario.id)
        for participacion in participaciones:
            if participacion.voluntario_id not in participantes:
                participantes.append(participacion.voluntario_id)
    return User.objects.filter(id__in=participantes)
