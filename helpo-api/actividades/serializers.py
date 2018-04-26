from rest_framework import serializers
from actividades.models import Actividad, Organizacion, TipoDeOrganizacion

class ActividadSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Actividad
        fields = ('nombre', 'fecha', 'organizacion')

class OrganizacionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Organizacion
        fields = ('nombre', 'tipo')

class TipoDeOrganizacionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TipoDeOrganizacion
        fields = ('nombre',)