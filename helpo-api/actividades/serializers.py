from rest_framework import serializers
from actividades.models import Evento, Organizacion, TipoDeOrganizacion, Ubicacion

class UbicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ubicacion
        fields = ('latitud', 'longitud', 'notas')

class EventoSerializer(serializers.ModelSerializer):
    ubicacion = UbicacionSerializer()
    
    class Meta:
        model = Evento
        fields = ('id', 'nombre', 'fecha', 'organizacion', 'ubicacion')

    def create(self, validated_data):
        ubicacion_data = validated_data.pop('ubicacion')
        ubicacion = Ubicacion.objects.create(**ubicacion_data)
        evento = Evento.objects.create(ubicacion=ubicacion, **validated_data)
        return evento
    
    #TODO: def update

class TipoDeOrganizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoDeOrganizacion
        fields = ('id', 'nombre')

class OrganizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organizacion
        fields = ('id', 'nombre', 'tipo')