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
        fields = ('nombre', 'email', 'telefono')

class EventoSerializer(serializers.ModelSerializer):
    ubicacion = UbicacionSerializer()
    rubro = RubroEventoSerializer(read_only=True)
    rubro_id = serializers.PrimaryKeyRelatedField(
        queryset=RubroEvento.objects.all(), source='rubro', write_only=True
    )
    contacto = ContactoSerializer(many=True)

    class Meta:
        model = Evento
        fields = ('id', 'nombre', 'descripcion', 'fecha_hora_inicio',
            'fecha_hora_fin', 'rubro', 'rubro_id', 'ubicacion', 'contacto')
        #fields = ('id', 'nombre', 'descripcion', 'fecha_hora_inicio',
        #    'fecha_hora_fin', 'rubro', 'ubicacion')

    def create(self, validated_data):
        ubicacion_data = validated_data.pop('ubicacion')
        ubicacion = Ubicacion.objects.create(**ubicacion_data)
        contactos_data = validate_data.pop('contacto')        
        evento = Evento.objects.create(ubicacion=ubicacion, **validated_data)
        for contacto_data in contactos_data:
            Contacto.objects.create(evento=evento, **contacto_data) 
        return evento
    
    #TODO: def update

