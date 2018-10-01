from django.db import models
from common.models import IndexedTimeStampedModel
from users.models import User

class RubroEvento(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre    

class Ubicacion(models.Model):
    latitud = models.FloatField()
    longitud = models.FloatField()
    notas = models.CharField(max_length=140, null=True)

    def __str__(self):
        return self.notas + " [" + str(self.latitud) + ", " + str(self.longitud) + "]"

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

    def __str__(self):
        return "Contacto: " + self.nombre

class CategoriaRecurso(models.Model):
    nombre = models.CharField(max_length=100)
    icono = models.CharField(max_length=50, null=True)

    def __str__(self):
        return self.nombre

class Recurso(models.Model):

    nombre = models.CharField(max_length=50)
    categoria = models.ForeignKey(CategoriaRecurso, null=False, on_delete=models.PROTECT)

    def __str__(self):
        return self.nombre

class Necesidad(models.Model):

    descripcion = models.CharField(max_length=140, null=True)
    cantidad = models.IntegerField()
    recurso = models.ForeignKey(Recurso, null=False, on_delete=models.PROTECT)
    evento = models.ForeignKey(Evento, related_name='necesidades', null=False, on_delete=models.CASCADE)

    def __str__(self):
        return self.evento.nombre + ' - ' + self.recurso.__str__()

class Funcion(models.Model):

    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre

class Voluntario(models.Model):

    descripcion = models.CharField(max_length=140, null=True)
    cantidad = models.IntegerField()
    funcion = models.ForeignKey(Funcion, null=False, on_delete=models.PROTECT)
    evento = models.ForeignKey(Evento, related_name='voluntarios', null=False, on_delete=models.CASCADE)    

    def __str__(self):
        return self.evento.nombre + ' - ' + self.funcion.__str__()

class Comentario(models.Model):
    evento = models.ForeignKey(Evento, related_name='comentarios', null=False, on_delete=models.CASCADE)
    voluntario = models.ForeignKey(User, null=False)
    comentario = models.CharField(max_length=280, null=False)

    def __str__(self):
        return "Comentario de " + str(self.voluntario)

class Colaboracion(models.Model):
    cantidad = models.IntegerField()
    comentario = models.CharField(max_length=140, null=True)
    necesidad_material = models.ForeignKey(Necesidad, related_name='colaboraciones', null=False, on_delete=models.CASCADE)
    colaborador = models.ForeignKey(User, related_name='colaboracion', null=False)
    entregado = models.BooleanField(null=False, blank=False, default=False)
    vigente = models.NullBooleanField(null=True, default=True)
    retroalimentacion_voluntario = models.BooleanField(default=False)
    retroalimentacion_ong = models.BooleanField(default=False)

    def __str__(self):
        return str(self.necesidad_material) + ": " + str(self.cantidad)

class Participacion(models.Model):
    comentario = models.CharField(max_length=140, null=True)
    necesidad_voluntario = models.ForeignKey(Voluntario, related_name='participaciones', null=False, on_delete=models.CASCADE)
    colaborador = models.ForeignKey(User, related_name='participacion', null=False)
    participo = models.BooleanField(null=False, blank=False, default=False)
    vigente = models.NullBooleanField(null=True, default=True)
    retroalimentacion_voluntario = models.BooleanField(default=False)
    retroalimentacion_ong = models.BooleanField(default=False)
    cantidad = models.IntegerField()

    def __str__(self):
        return str(self.necesidad_voluntario) + " " + str(self.colaborador)

class ActividadesTasks(models.Model):
    evento = models.ForeignKey(Evento, null=True, blank=True)
    tipo = models.CharField(max_length=140, null=False, blank=False)
    execute_date = models.DateTimeField(null=False, blank=False)

class EventoImagen(models.Model):
    url = models.TextField()    
    evento = models.ForeignKey(Evento, null=False, blank=False)

    def __str__(self):
        return self.url
    
class Mensaje(IndexedTimeStampedModel):
    evento = models.ForeignKey(Evento, related_name='mensajes', null=False, on_delete=models.CASCADE)
    asunto = models.CharField(max_length=100, null=False)
    mensaje = models.CharField(max_length=1000, null=False)

    def __str__(self):
        return self.asunto

class LogMensaje(IndexedTimeStampedModel):
    mensaje = models.ForeignKey(Mensaje, related_name='envios', null=False, on_delete=models.CASCADE)
    usuario = models.ForeignKey(User, null=False)

    def __str__(self):
        return self.usuario.__str__() + " - " + self.mensaje.__str__()

class Propuesta(IndexedTimeStampedModel):
    OFRECIMIENTO_STATUS = (
        (-1, 'rechazado'),
        (0, 'pendiente'),
        (1, 'aceptado'),
    )
    empresa = models.ForeignKey(User, related_name='propuestas', null=False)
    evento = models.ForeignKey(Evento, related_name='propuestas', null=False, on_delete=models.CASCADE)
    aceptado = models.SmallIntegerField(choices=OFRECIMIENTO_STATUS, default=0, null=False, blank=False)
    comentario = models.CharField(max_length=280, null=True)

    def __str__(self):
        return self.empresa.__str__() + " - " + self.evento.__str__()