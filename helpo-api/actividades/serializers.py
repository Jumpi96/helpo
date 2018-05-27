from rest_framework import serializers
from actividades.models import Evento, RubroEvento, Ubicacion, Contacto

class RubroEventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RubroEvento
        fields = ('id', 'nombre')

class UbicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ubicacion
        fields = ('latitud', 'longitud', 'notas')

class ContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contacto
        fields = ('nombre', 'mail', 'telefono')

class EventoSerializer(serializers.ModelSerializer):
    ubicacion = UbicacionSerializer()
    rubro = RubroEventoSerializer(read_only=True)
    rubro_id = serializers.PrimaryKeyRelatedField(
        queryset=RubroEvento.objects.all(), source='rubro', write_only=True
    )

    class Meta:
        model = Evento
        fields = '__all__'
        #fields = ('id', 'nombre', 'descripcion', 'fecha_hora_inicio',
        #    'fecha_hora_fin', 'rubro', 'ubicacion')

    def create(self, validated_data):
        ubicacion_data = validated_data.pop('ubicacion')
        ubicacion = Ubicacion.objects.create(**ubicacion_data)
        evento = Evento.objects.create(ubicacion=ubicacion, **validated_data)
        return evento
    
    #TODO: def update

