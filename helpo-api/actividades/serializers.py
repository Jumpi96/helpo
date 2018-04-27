from rest_framework import serializers
from actividades.models import Actividad, Organizacion, TipoDeOrganizacion

class ActividadSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Actividad
        fields = ('nombre', 'fecha', 'organizacion')

class TipoDeOrganizacionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TipoDeOrganizacion
        fields = ('nombre',)

class OrganizacionSerializer(serializers.HyperlinkedModelSerializer):
    tipo = serializers.HyperlinkedRelatedField(
            queryset='get_put_delete_tipo_de_organizacion',
            view_name='get_put_delete_tipo_de_organizacion', 
            lookup_field='id'
    )

    class Meta:
        model = Organizacion
        fields = ('nombre', 'tipo')