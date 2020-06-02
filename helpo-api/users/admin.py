from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import ugettext_lazy as _

from .models import User, AppValues, Imagen, Suscripcion, OrganizationArea, OrganizacionProfile, \
    Ubicacion, EmpresaProfile, VolunteerProfile, RubroEmpresa, Skill, State, Modality


class SimpleUserAdmin(admin.ModelAdmin):
    list_display = ['id', 'email', 'is_confirmed']

class CustomAppValuesAdmin(admin.ModelAdmin):
    list_display = ['key', 'value']

class ImagenAdmin(admin.ModelAdmin):
    list_display =  ['id', 'url']

class SuscripcionAdmin(admin.ModelAdmin):
    list_display = ['id', 'usuario', 'organizacion']

class OrganizationAreaAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre']

class OrganizacionProfileAdmin(admin.ModelAdmin):
    list_display = ['id', 'verificada', 'telefono', 'cuit', 'rubro', 'avatar', 'ubicacion', 'descripcion']

class UbicacionAdmin(admin.ModelAdmin):
    list_display = ['id', 'latitud', 'longitud', 'notas']

class EmpresaProfileAdmin(admin.ModelAdmin):
    list_display = ['id', 'verificada', 'telefono', 'cuit', 'rubro', 'avatar', 'descripcion', 'ubicacion']

class VolunteerProfileAdmin(admin.ModelAdmin):
    list_display = ['id', 'usuario', 'avatar', 'gender', 'last_name', 'birth_date', \
        'phone', 'profession', 'experience', 'educational_level', 'availability', 'modality']

class RubroEmpresaAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre']

class SkillAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre']

class StateAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre']

class ModalityAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre']

admin.site.register(User, SimpleUserAdmin)
admin.site.register(AppValues, CustomAppValuesAdmin)
admin.site.register(Imagen, ImagenAdmin)
admin.site.register(Suscripcion, SuscripcionAdmin)
admin.site.register(OrganizationArea, OrganizationAreaAdmin)
admin.site.register(Ubicacion, UbicacionAdmin)
admin.site.register(OrganizacionProfile, OrganizacionProfileAdmin)
admin.site.register(EmpresaProfile, EmpresaProfileAdmin)
admin.site.register(VolunteerProfile, VolunteerProfileAdmin)
admin.site.register(Skill, SkillAdmin)
admin.site.register(State, StateAdmin)
admin.site.register(Modality, ModalityAdmin)
admin.site.register(RubroEmpresa, RubroEmpresaAdmin)
