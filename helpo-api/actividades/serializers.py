from rest_framework import serializers
from actividades.models import Evento, RubroEvento, Ubicacion, CategoriaRecurso, Recurso, Necesidad, Contacto

class RubroEventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RubroEvento
        fields = ('id', 'nombre')

class UbicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ubicacion
        fields = ('latitud', 'longitud', 'notas')
        extra_kwargs = {
            'notas': {
                'required': False,
                'allow_blank': True,
            }
        }

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
        extra_kwargs = {
            'descripcion': {
                'required': False,
                'allow_blank': True,
            }
        }

    def create(self, validated_data):
        ubicacion_data = validated_data.pop('ubicacion')
        ubicacion = Ubicacion.objects.create(**ubicacion_data)
        contactos_data = validated_data.pop('contacto')        
        evento = Evento.objects.create(ubicacion=ubicacion, **validated_data)
        for contacto_data in contactos_data:
            Contacto.objects.create(evento=evento, **contacto_data) 
        return evento
    
    #TODO: def update

class CategoriaRecursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaRecurso
        fields = ('id', 'nombre', 'icono')

class RecursoSerializer(serializers.ModelSerializer):
    categoria = CategoriaRecursoSerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(
        queryset=CategoriaRecurso.objects.all(), source='categoria', write_only=True
    )

    class Meta:
        model = Recurso
        fields = '__all__'

class NecesidadSerializer(serializers.ModelSerializer):
    recurso = RecursoSerializer(read_only=True)
    recurso_id = serializers.PrimaryKeyRelatedField(
        queryset=Recurso.objects.all(), source='recurso', write_only=True
    )

    class Meta:
        model = Necesidad
        fields = '__all__'