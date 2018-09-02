from django.contrib import admin
from .models import Evento, ActividadesTasks
# Register your models here.

class EventoAdmin(admin.ModelAdmin):
    list_display = ['id' ,'nombre', 'organizacion', 'fecha_hora_inicio', 'fecha_hora_fin', 'rubro']

class ActividadesTasksAdmin(admin.ModelAdmin):
    list_display = ['tipo', 'execute_date', 'evento']

admin.site.register(Evento, EventoAdmin)
admin.site.register(ActividadesTasks, ActividadesTasksAdmin)