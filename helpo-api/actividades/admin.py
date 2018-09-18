from django.contrib import admin
from .models import Evento, ActividadesTasks, RubroEvento, CategoriaRecurso, Recurso, Necesidad, Funcion, Voluntario
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

admin.site.register(Evento, EventoAdmin)
admin.site.register(ActividadesTasks, ActividadesTasksAdmin)
admin.site.register(RubroEvento, RubroEventoAdmin)
admin.site.register(CategoriaRecurso, CategoriaRecursoAdmin)
admin.site.register(Recurso, RecursoAdmin)
admin.site.register(Necesidad, NecesidadAdmin)
admin.site.register(Funcion, FuncionAdmin)
admin.site.register(Voluntario, VoluntarioAdmin)