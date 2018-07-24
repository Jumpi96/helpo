from rest_framework import serializers
from actividades.models import Evento, RubroEvento, Ubicacion, CategoriaRecurso, \
    Recurso, Necesidad, Contacto, Funcion, Voluntario, Participacion, Colaboracion
from users.serializers import UserSerializer

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
            'fecha_hora_fin', 'rubro', 'rubro_id', 'ubicacion', 'contacto', 'organizacion_id')
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
    
    def update(self, instance, validated_data):
        ubicacion_data = validated_data.pop('ubicacion')
        ubicacion = Ubicacion.objects.get_or_create(**ubicacion_data)
        contactos_data = validated_data.pop('contacto')
        Contacto.objects.filter(evento_id=instance.id).delete()
        for contacto_data in contactos_data:
            Contacto.objects.create(evento=instance, **contacto_data)
        instance.nombre = validated_data.get('nombre')
        instance.descripcion = validated_data.get('descripcion')
        instance.fecha_hora_inicio = validated_data.get('fecha_hora_inicio')
        instance.fecha_hora_fin = validated_data.get('fecha_hora_fin')
        instance.rubro = RubroEvento.objects.get(pk=validated_data.get('rubro').id)
        instance.save()
        return instance

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

class FuncionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Funcion
        fields = ('id', 'nombre')

class VoluntarioSerializer(serializers.ModelSerializer):
    funcion = FuncionSerializer(read_only=True)
    funcion_id = serializers.PrimaryKeyRelatedField(
        queryset=Funcion.objects.all(), source='funcion', write_only=True
    )

    class Meta:
        model = Voluntario
        fields = '__all__'


class ConsultaEventoSerializer(serializers.ModelSerializer):
    ubicacion = UbicacionSerializer()
    rubro = RubroEventoSerializer(read_only=True)
    rubro_id = serializers.PrimaryKeyRelatedField(
        queryset=RubroEvento.objects.all(), source='rubro', write_only=True
    )
    contacto = ContactoSerializer(many=True)
    necesidades = NecesidadSerializer(many=True)
    voluntarios = VoluntarioSerializer(many=True)
    organizacion = UserSerializer()

    class Meta:
        model = Evento
        fields = ('id', 'nombre', 'descripcion', 'fecha_hora_inicio',
            'fecha_hora_fin', 'rubro', 'rubro_id', 'ubicacion', 'contacto', 'organizacion_id',
            'necesidades', 'organizacion', 'voluntarios')

class ColaboracionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Colaboracion
        fields = '__all__'

class ConsultaNecesidadSerializer(serializers.ModelSerializer):
    colaboraciones = ColaboracionSerializer(many=True)
    recurso = RecursoSerializer(read_only=True)
    recurso_id = serializers.PrimaryKeyRelatedField(
        queryset=Recurso.objects.all(), source='recurso', write_only=True
    )

    class Meta:
        model = Necesidad
        fields = ('id', 'descripcion', 'cantidad', 'recurso', 'recurso_id', 'colaboraciones')

class ParticipacionSerializer(serializers.ModelSerializer):
    necesidad_voluntario_id = serializers.PrimaryKeyRelatedField(
        queryset=Voluntario.objects.all(), source='necesidad_voluntario'
    )
    
    class Meta:
        model = Participacion
        fields = ('id', 'comentario', 'necesidad_voluntario_id', 'voluntario_id')

    def create(self, validated_data):
        necesidad_voluntario = validated_data.get('necesidad_voluntario')
        participaciones = Participacion.objects.filter(necesidad_voluntario_id=necesidad_voluntario.id)
        if len(participaciones) < necesidad_voluntario.cantidad:
            participacion = Participacion.objects.create(necesidad_voluntario_id=necesidad_voluntario.id, **validated_data)
            return participacion
        else:
            raise serializers.ValidationError()

class ConsultaVoluntarioSerializer(serializers.ModelSerializer):
    participaciones = ParticipacionSerializer(many=True)
    funcion = FuncionSerializer(read_only=True)
    funcion_id = serializers.PrimaryKeyRelatedField(
        queryset=Funcion.objects.all(), source='funcion', write_only=True
    )

    class Meta:
        model = Voluntario
        fields = ('id', 'descripcion', 'cantidad', 'funcion', 'funcion_id', 'participaciones')

class ConsultaNecesidadesSerializer(serializers.ModelSerializer):
    necesidades = ConsultaNecesidadSerializer(many=True)
    voluntarios = ConsultaVoluntarioSerializer(many=True)

    class Meta:
        model = Evento
        fields = ('id', 'nombre', 'necesidades', 'voluntarios')