from rest_framework import serializers
from actividades.models import Actividad, Organizacion, TipoDeOrganizacion, Ubicacion

class UbicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ubicacion
        fields = ('latitud', 'longitud', 'notas')

class ActividadSerializer(serializers.ModelSerializer):
    ubicacion = UbicacionSerializer()
    
    class Meta:
        model = Actividad
        fields = ('id', 'nombre', 'fecha', 'organizacion', 'ubicacion')

    def create(self, validated_data):
        ubicacion_data = validated_data.pop('ubicacion')
        ubicacion = Ubicacion.objects.create(**ubicacion_data)
        actividad = Actividad.objects.create(ubicacion=ubicacion, **validated_data)
        return actividad
    
    #TODO: def update

class TipoDeOrganizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoDeOrganizacion
        fields = ('id', 'nombre')

class OrganizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizacion
        fields = ('id', 'nombre', 'tipo')