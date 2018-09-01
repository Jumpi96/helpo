from django.contrib import admin
from .models import Evento
# Register your models here.

class EventoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'organizacion', 'fecha_hora_inicio', 'fecha_hora_fin', 'rubro']

admin.site.register(Evento, EventoAdmin)