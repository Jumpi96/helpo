from rest_framework import serializers
from actividades.models import Evento, RubroEvento, Ubicacion, CategoriaRecurso, \
    Recurso, Necesidad, Contacto, Funcion, Voluntario, Participacion, Colaboracion, Comentario, Mensaje, EventoImagen
from actividades.services import send_mail_mensaje_evento, send_previous_mail_evento
from users.serializers import UserSerializer, VoluntarioInfoSerializer
from users.models import User

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
            'fecha_hora_fin', 'rubro', 'rubro_id', 'ubicacion', 'contacto', 'organizacion_id', 'estado')
        extra_kwargs = {
            'descripcion': {
                'required': False,
                'allow_blank': True,
            }        
        }
        read_only_fields = ('estado',)

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

class ComentarioSerializer(serializers.ModelSerializer):
    evento_id = serializers.PrimaryKeyRelatedField(
        queryset=Evento.objects.all(), source='evento'
    )
    voluntario_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='voluntario'
    )
    voluntario = VoluntarioInfoSerializer(read_only=True)

    class Meta:
        model = Comentario
        fields = ('id', 'comentario', 'voluntario', 'voluntario_id', 'evento_id')



class ColaboracionSerializer(serializers.ModelSerializer):
    necesidad_material_id = serializers.PrimaryKeyRelatedField(
        queryset=Necesidad.objects.all(), source='necesidad_material'
    )
    voluntario = VoluntarioInfoSerializer(read_only=True)

    class Meta:
        model = Colaboracion
        fields = ('id', 'comentario', 'cantidad', 'necesidad_material_id', 'voluntario', 'entregado', 'retroalimentacion_voluntario', 'retroalimentacion_ong')
    
    def create(self, validated_data):
        necesidad_material = validated_data.get('necesidad_material')
        colaboraciones = Colaboracion.objects.filter(necesidad_material_id=necesidad_material.id)
        cantidad = validated_data.get('cantidad')
        suma_colaboraciones = 0
        for c in colaboraciones:
            suma_colaboraciones += c.cantidad
        if (suma_colaboraciones + cantidad) <= necesidad_material.cantidad:
            voluntario_id = validated_data['voluntario_id']
            send_previous_mail_evento(necesidad_material.evento_id, voluntario_id)
            colaboracion = Colaboracion.objects.create(necesidad_material_id=necesidad_material.id, **validated_data)
            self.send_colaboracion_email(voluntario_id)
            return colaboracion
        else:
            raise serializers.ValidationError()
    
    def send_colaboracion_email(self, voluntario_id):
        subject = "Registro de su colaboración en Helpo"
        content = 'Usted se ha colaborado con Helpo'

        from common.notifications import send_mail_to_id
        send_mail_to_id(id_to=voluntario_id, subject=subject, html_content=content)


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
    voluntario = VoluntarioInfoSerializer(read_only=True)
    
    class Meta:
        model = Participacion
        fields = ('id', 'comentario', 'necesidad_voluntario_id', 'voluntario', 'participo', 'retroalimentacion_voluntario', 'retroalimentacion_ong')

    def create(self, validated_data):
        necesidad_voluntario = validated_data.get('necesidad_voluntario')
        participaciones = Participacion.objects.filter(necesidad_voluntario_id=necesidad_voluntario.id)
        if len(participaciones) < necesidad_voluntario.cantidad:
            voluntario_id = validated_data['voluntario_id']
            participacion = Participacion.objects.create(necesidad_voluntario_id=necesidad_voluntario.id, **validated_data)
            send_previous_mail_evento(necesidad_voluntario.evento_id, voluntario_id)
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
        fields = ('id', 'nombre', 'necesidades', 'voluntarios', 'fecha_hora_inicio')

class ConsultaEventoSerializer(serializers.ModelSerializer):
    ubicacion = UbicacionSerializer()
    rubro = RubroEventoSerializer(read_only=True)
    rubro_id = serializers.PrimaryKeyRelatedField(
        queryset=RubroEvento.objects.all(), source='rubro', write_only=True
    )
    contacto = ContactoSerializer(many=True)
    necesidades = ConsultaNecesidadSerializer(many=True)
    voluntarios = ConsultaVoluntarioSerializer(many=True)
    comentarios = ComentarioSerializer(many=True)
    organizacion = UserSerializer()

    class Meta:
        model = Evento
        fields = ('id', 'nombre', 'descripcion', 'fecha_hora_inicio',
            'fecha_hora_fin', 'rubro', 'rubro_id', 'ubicacion', 'contacto', 'organizacion_id',
            'necesidades', 'organizacion', 'voluntarios', 'comentarios', 'estado')

class EventoImagenSerializer(serializers.ModelSerializer):

    class Meta:
        model = EventoImagen
        fields = ('id', 'url', 'evento', 'necesidades', 'organizacion', 'voluntarios', 'comentarios')

class MensajeSerializer(serializers.ModelSerializer):
    evento_id = serializers.PrimaryKeyRelatedField(
        queryset=Evento.objects.all(), source='evento'
    )

    class Meta:
        model = Mensaje
        fields = ('id', 'mensaje', 'evento_id', 'created')

    def create(self, validated_data):
        mensaje = Mensaje.objects.create(**validated_data)
        send_mail_mensaje_evento(mensaje, validated_data.get('evento').id)
        return mensaje
