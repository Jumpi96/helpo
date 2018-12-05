from django.db import models
from common.models import IndexedTimeStampedModel
from users.models import User
from actividades.models import Evento


class LogConsultaEvento(IndexedTimeStampedModel):
    evento = models.ForeignKey(Evento, related_name='visitas', null=False, on_delete=models.CASCADE)
    usuario = models.ForeignKey(User, null=False)