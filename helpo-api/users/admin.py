from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import ugettext_lazy as _

from .models import User, AppValues, Imagen, Suscripcion, RubroOrganizacion, OrganizacionProfile, Ubicacion, EmpresaProfile, VoluntarioProfile, RubroEmpresa


class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'email', 'created', 'modified')
    list_filter = ('is_active', 'is_staff', 'groups')
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')}),
    )

class CustomAppValuesAdmin(admin.ModelAdmin):
    list_display = ['key', 'value']

class ImagenAdmin(admin.ModelAdmin):
    list_display =  ['id', 'url']

class SuscripcionAdmin(admin.ModelAdmin):
    list_display = ['id', 'usuario', 'organizacion']

class RubroOrganizacionAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre']

class OrganizacionProfileAdmin(admin.ModelAdmin):
    list_display = ['id', 'verificada', 'telefono', 'cuit', 'rubro', 'avatar', 'ubicacion', 'descripcion']

class UbicacionAdmin(admin.ModelAdmin):
    list_display = ['id', 'latitud', 'longitud', 'notas']

class EmpresaProfileAdmin(admin.ModelAdmin):
    list_display = ['id', 'verificada', 'telefono', 'cuit', 'rubro', 'avatar', 'descripcion', 'ubicacion']

class VoluntarioProfileAdmin(admin.ModelAdmin):
    list_display = ['id', 'usuario', 'sexo', 'apellido', 'dni', 'telefono', 'avatar', 'gustos', 'habilidades'] 

class RubroEmpresaAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre']

admin.site.register(User, CustomUserAdmin)
admin.site.register(AppValues, CustomAppValuesAdmin)
admin.site.register(Imagen, ImagenAdmin)
admin.site.register(Suscripcion, SuscripcionAdmin)
admin.site.register(RubroOrganizacion, RubroOrganizacionAdmin)
admin.site.register(Ubicacion, UbicacionAdmin)
admin.site.register(OrganizacionProfile, OrganizacionProfileAdmin)
admin.site.register(EmpresaProfile, EmpresaProfileAdmin)
admin.site.register(VoluntarioProfile, VoluntarioProfileAdmin)
admin.site.register(RubroEmpresa, RubroEmpresaAdmin)
