from django.contrib import admin
from .models import Evento, ActividadesTasks, RubroEvento, CategoriaRecurso, Recurso, Necesidad, Funcion, Voluntario, Comentario, Colaboracion, Participacion, EventoImagen, Mensaje, LogMensaje, Propuesta
# Register your models here.

class EventoAdmin(admin.ModelAdmin):
    list_display = ['id' ,'nombre', 'organizacion', 'fecha_hora_inicio', 'fecha_hora_fin', 'rubro']

class ActividadesTasksAdmin(admin.ModelAdmin):
    list_display = ['tipo', 'execute_date', 'evento']

class RubroEventoAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre']

class CategoriaRecursoAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'icono']    

class RecursoAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre', 'categoria']

class NecesidadAdmin(admin.ModelAdmin):
    list_display = ['id', 'evento', 'recurso', 'cantidad', 'descripcion']

class FuncionAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre']

class VoluntarioAdmin(admin.ModelAdmin):
    list_display = ['id', 'evento', 'funcion', 'cantidad', 'descripcion']

class ComentarioAdmin(admin.ModelAdmin):
    list_display = ['id', 'evento', 'voluntario', 'comentario']

class ColaboracionAdmin(admin.ModelAdmin):
    list_display = ['id', 'cantidad', 'comentario', 'necesidad_material', 'colaborador', 'entregado', 'vigente', 'retroalimentacion_voluntario', 'retroalimentacion_ong']

class ParticipacionAdmin(admin.ModelAdmin):
    list_display = ['id', 'comentario', 'necesidad_voluntario', 'colaborador', 'participo', 'vigente', 'retroalimentacion_voluntario', 'retroalimentacion_ong', 'cantidad']

class EventoImagenAdmin(admin.ModelAdmin):
    list_display = ['id', 'url', 'evento']

class MensajeAdmin(admin.ModelAdmin):
    list_display = ['id', 'evento', 'asunto', 'mensaje']

class LogMensajeAdmin(admin.ModelAdmin):
    list_display = ['id', 'mensaje', 'usuario']

class PropuestaAdmin(admin.ModelAdmin):
    list_display = ['id', 'empresa', 'evento', 'aceptado', 'comentario']


admin.site.register(Evento, EventoAdmin)
admin.site.register(ActividadesTasks, ActividadesTasksAdmin)
admin.site.register(RubroEvento, RubroEventoAdmin)
admin.site.register(CategoriaRecurso, CategoriaRecursoAdmin)
admin.site.register(Recurso, RecursoAdmin)
admin.site.register(Necesidad, NecesidadAdmin)
admin.site.register(Funcion, FuncionAdmin)
admin.site.register(Voluntario, VoluntarioAdmin)
admin.site.register(Comentario, ComentarioAdmin)
admin.site.register(Colaboracion, ColaboracionAdmin)
admin.site.register(Participacion, ParticipacionAdmin)
admin.site.register(EventoImagen, EventoImagenAdmin)
admin.site.register(Mensaje, MensajeAdmin)
admin.site.register(LogMensaje, LogMensajeAdmin)
admin.site.register(Propuesta, PropuestaAdmin)