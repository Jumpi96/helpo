from django.db import models
from common.models import IndexedTimeStampedModel

class TipoDeOrganizacion(models.Model):
    nombre = models.CharField(max_length=100)

class Organizacion(IndexedTimeStampedModel):
    nombre = models.CharField(max_length=100)
    tipo = models.ForeignKey(TipoDeOrganizacion, null=True, on_delete=models.SET_NULL)

class Actividad(IndexedTimeStampedModel):
    nombre = models.CharField(max_length=100)
    fecha = models.DateTimeField()
    organizacion = models.ForeignKey(Organizacion, on_delete=models.CASCADE)


