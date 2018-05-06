from django.db import models
from common.models import IndexedTimeStampedModel

class RubroEvento(models.Model):
    nombre = models.CharField(max_length=100)

class Ubicacion(models.Model):
    latitud = models.FloatField()
    longitud = models.FloatField()
    notas = models.CharField(max_length=140)

class Evento(IndexedTimeStampedModel):
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=1000, null=True)
    fecha_hora = models.DateTimeField()
    duracion = models.IntegerField() # En minutos
    rubro = models.ForeignKey(RubroEvento, null=True, on_delete=models.SET_NULL)
    ubicacion = models.ForeignKey(Ubicacion, null=True, on_delete=models.SET_NULL)