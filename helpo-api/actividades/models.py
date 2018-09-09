from django.db import models
from common.models import IndexedTimeStampedModel
from users.models import User

class RubroEvento(models.Model):
    nombre = models.CharField(max_length=100)

class Ubicacion(models.Model):
    latitud = models.FloatField()
    longitud = models.FloatField()
    notas = models.CharField(max_length=140, null=True)

class Evento(IndexedTimeStampedModel):

    EVENTO_STATUS = (
        (0, 'other'),
        (1, 'created'),
        (2, 'in_progress'),
        (3, 'finalized')
    )

    def __str__(self):
        show = self.organizacion.nombre + " - " + self.nombre
        return show

    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=1000, null=True)
    fecha_hora_inicio = models.DateTimeField()
    fecha_hora_fin = models.DateTimeField()
    rubro = models.ForeignKey(RubroEvento, null=True, on_delete=models.SET_NULL)  
    ubicacion = models.ForeignKey(Ubicacion, null=True, on_delete=models.SET_NULL)
    organizacion = models.ForeignKey(User, null=False)
    estado = models.PositiveSmallIntegerField(choices=EVENTO_STATUS, default=1, null=False, blank=False)

class Contacto(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField(max_length=100,blank=True,null=True)
    telefono = models.BigIntegerField(blank=True,null=True) 
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
    evento = models.ForeignKey(Evento, related_name='necesidades', null=False, on_delete=models.CASCADE)

class Funcion(models.Model):
    nombre = models.CharField(max_length=50)

class Voluntario(models.Model):
    descripcion = models.CharField(max_length=140, null=True)
    cantidad = models.IntegerField()
    funcion = models.ForeignKey(Funcion, null=False, on_delete=models.PROTECT)
    evento = models.ForeignKey(Evento, related_name='voluntarios', null=False, on_delete=models.CASCADE)

class Comentario(models.Model):
    evento = models.ForeignKey(Evento, related_name='comentarios', null=False, on_delete=models.CASCADE)
    voluntario = models.ForeignKey(User, null=False)
    comentario = models.CharField(max_length=280, null=False)

class Colaboracion(models.Model):
    cantidad = models.IntegerField()
    comentario = models.CharField(max_length=140, null=True)
    necesidad_material = models.ForeignKey(Necesidad, related_name='colaboraciones', null=False, on_delete=models.CASCADE)
    colaborador = models.ForeignKey(User, null=False)
    entregado = models.BooleanField(null=False, blank=False, default=False)
    vigente = models.NullBooleanField(null=True, default=True)
    retroalimentacion_voluntario = models.BooleanField(default=False)
    retroalimentacion_ong = models.BooleanField(default=False)

class Participacion(models.Model):
    comentario = models.CharField(max_length=140, null=True)
    necesidad_voluntario = models.ForeignKey(Voluntario, related_name='participaciones', null=False, on_delete=models.CASCADE)
    colaborador = models.ForeignKey(User, null=False)
    participo = models.BooleanField(null=False, blank=False, default=False)
    vigente = models.NullBooleanField(null=True, default=True)
    retroalimentacion_voluntario = models.BooleanField(default=False)
    retroalimentacion_ong = models.BooleanField(default=False)
    cantidad = models.IntegerField()

class ActividadesTasks(models.Model):
    evento = models.ForeignKey(Evento, null=True, blank=True)
    tipo = models.CharField(max_length=140, null=False, blank=False)
    execute_date = models.DateTimeField(null=False, blank=False)

class EventoImagen(models.Model):

    url = models.TextField()    
    evento = models.ForeignKey(Evento, null=False, blank=False)
    
class Mensaje(IndexedTimeStampedModel):
    evento = models.ForeignKey(Evento, related_name='mensajes', null=False, on_delete=models.CASCADE)
    asunto = models.CharField(max_length=100, null=False)
    mensaje = models.CharField(max_length=1000, null=False)

class LogMensaje(IndexedTimeStampedModel):
    mensaje = models.ForeignKey(Mensaje, related_name='envios', null=False, on_delete=models.CASCADE)
    usuario = models.ForeignKey(User, null=False)

class Pedido(IndexedTimeStampedModel):
    OFRECIMIENTO_STATUS = (
        (-1, 'rechazado'),
        (0, 'pendiente'),
        (1, 'aceptado'),
    )
    empresa = models.ForeignKey(User, null=False)
    evento = models.ForeignKey(Evento, related_name='ofrecimientos', null=False, on_delete=models.CASCADE)
    aceptado = models.PositiveSmallIntegerField(choices=OFRECIMIENTO_STATUS, default=0, null=False, blank=False)

