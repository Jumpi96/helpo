from rest_framework import serializers
from actividades.models import Evento, RubroEvento, Ubicacion

class RubroEventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RubroEvento
        fields = ('id', 'nombre')

class UbicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ubicacion
        fields = ('latitud', 'longitud', 'notas')

class EventoSerializer(serializers.ModelSerializer):
    ubicacion = UbicacionSerializer()
    
    class Meta:
        model = Evento
        fields = ('id', 'nombre', 'descripcion', 'fecha_hora',
            'duracion', 'rubro_id', 'ubicacion')

    def create(self, validated_data):
        ubicacion_data = validated_data.pop('ubicacion')
        ubicacion = Ubicacion.objects.create(**ubicacion_data)
        evento = Evento.objects.create(ubicacion=ubicacion, **validated_data)
        return evento
    
    #TODO: def update

