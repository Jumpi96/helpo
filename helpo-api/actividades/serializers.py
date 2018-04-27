from rest_framework import serializers
from actividades.models import Actividad, Organizacion, TipoDeOrganizacion

class ActividadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actividad
        fields = ('nombre', 'fecha', 'organizacion')

class TipoDeOrganizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoDeOrganizacion
        fields = ('nombre',)

class OrganizacionSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Organizacion
        fields = ('nombre', 'tipo')