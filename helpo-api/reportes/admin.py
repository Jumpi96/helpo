from django.contrib import admin
from users.models import OrganizacionSuscripcionesMensuales


class ONGSuscripcionesAdmin(admin.ModelAdmin):
    list_display = ['id', 'fecha', 'suscripciones', 'organizacion']


admin.site.register(OrganizacionSuscripcionesMensuales, ONGSuscripcionesAdmin)
