from django.db import models
from common.models import IndexedTimeStampedModel

class RubroEvento(models.Model):
    nombre = models.CharField(max_length=100)

class Ubicacion(models.Model):
    latitud = models.FloatField()
    longitud = models.FloatField()
    notas = models.CharField(max_length=140, null=True)

class Evento(IndexedTimeStampedModel):
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=1000, null=True)
    fecha_hora_inicio = models.DateTimeField()
    fecha_hora_fin = models.DateTimeField()
    rubro = models.ForeignKey(RubroEvento, null=True, on_delete=models.SET_NULL)
    ubicacion = models.ForeignKey(Ubicacion, null=True, on_delete=models.SET_NULL)

class Contacto(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField(max_length=100,blank=True,null=True)
    telefono = models.IntegerField(blank=True,null=True) 
    evento = models.ForeignKey(Evento, related_name='contacto', null=False, on_delete=models.CASCADE)

class CategoriaRecurso(models.Model):
    nombre = models.CharField(max_length=100)
    icono = models.CharField(max_length=50, null=True)

class Recurso(models.Model):
    nombre = models.CharField(max_length=50)
    categoria = models.ForeignKey(CategoriaRecurso, null=False, on_delete=models.PROTECT)

class Necesidad(models.Model):
    descripcion = models.CharField(max_length=140, null=True)
    cantidad = models.IntegerField()
    recurso = models.ForeignKey(Recurso, null=False, on_delete=models.PROTECT)
    evento = models.ForeignKey(Evento, null=False, on_delete=models.CASCADE)
