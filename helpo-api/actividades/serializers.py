from rest_framework import serializers
from actividades.models import Evento, RubroEvento, Ubicacion, CategoriaRecurso, \
    Recurso, Necesidad, Contacto, Funcion, Voluntario, Participacion, Colaboracion, Comentario, Mensaje, EventoImagen, \
    Propuesta, Entrega, Presencia
from actividades.services import send_mail_mensaje_evento, send_previous_mail_evento, response_propuesta, deny_propuesta, send_full_participacion_mail, send_full_colaboracion_mail, send_was_full_colaboracion_mail
from users.serializers import UserSerializer, ColaboradorInfoSerializer
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
        fields = ('id', 'nombre', 'descripcion', 'fecha_hora_inicio', 'horarios',
            'fecha_hora_fin', 'rubro', 'rubro_id', 'ubicacion', 'contacto', 'organizacion_id', 'estado', 'campaña')
        extra_kwargs = {
            'descripcion': {
                'required': False,
                'allow_blank': True,
            },
            'horarios': {
                'required': False,
                'default': []
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
        ubicacion = Ubicacion.objects.filter(latitud=ubicacion_data.get('latitud'),
                                             longitud=ubicacion_data.get('longitud'), notas=ubicacion_data.get('notas'))
        if len(ubicacion) == 0:
            ubicacion = Ubicacion.objects.create(**ubicacion_data)
        else:
            ubicacion = ubicacion[0]
        contactos_data = validated_data.pop('contacto')
        Contacto.objects.filter(evento_id=instance.id).delete()
        for contacto_data in contactos_data:
            Contacto.objects.create(evento=instance, **contacto_data)
        instance.nombre = validated_data.get('nombre')
        instance.descripcion = validated_data.get('descripcion')
        instance.fecha_hora_inicio = validated_data.get('fecha_hora_inicio')
        instance.fecha_hora_fin = validated_data.get('fecha_hora_fin')
        instance.ubicacion = ubicacion
        instance.horarios = validated_data.get('horarios')
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
    voluntario = ColaboradorInfoSerializer(read_only=True)

    class Meta:
        model = Comentario
        fields = ('id', 'comentario', 'voluntario',
                  'voluntario_id', 'evento_id')


class ColaboracionSerializer(serializers.ModelSerializer):
    necesidad_material_id = serializers.PrimaryKeyRelatedField(
        queryset=Necesidad.objects.all(), source='necesidad_material'
    )
    colaborador = ColaboradorInfoSerializer(read_only=True)
    entregados = serializers.SerializerMethodField()

    class Meta:
        model = Colaboracion
        fields = ('id', 'comentario', 'cantidad', 'necesidad_material_id', 'colaborador',
                  'entregados', 'retroalimentacion_voluntario', 'retroalimentacion_ong')

    def get_entregados(self, instance):
        from django.db.models import Sum
        entregas = Entrega.objects.filter(colaboracion=instance)
        if entregas:
            return entregas.aggregate(Sum('cantidad'))['cantidad__sum']
        return 0

    def create(self, validated_data):
        necesidad_material = validated_data.get('necesidad_material')
        colaboraciones = Colaboracion.objects.filter(
            necesidad_material_id=necesidad_material.id, vigente=True)
        cantidad = validated_data.get('cantidad')
        suma_colaboraciones = 0
        for c in colaboraciones:
            suma_colaboraciones += c.cantidad
        if (suma_colaboraciones + cantidad) <= necesidad_material.cantidad:
            colaboracion = Colaboracion.objects.create(
                necesidad_material_id=necesidad_material.id, vigente=True, **validated_data)
            colaborador_id = validated_data['colaborador_id']
            if (User.objects.get(id=colaborador_id).user_type == 2):
                evento = validated_data['necesidad_material'].evento
                titulo_email = "Usted se ha registrado para colaborar con los siguientes datos:"
                self.send_colaboracion_email(
                    colaborador_id, evento, colaboracion, titulo_email)
            if (suma_colaboraciones + cantidad) == necesidad_material.cantidad:
                send_full_colaboracion_mail(necesidad_material)
            return colaboracion
        else:
            raise serializers.ValidationError()

    def update(self, instance, validated_data):
        colaborador_id = instance.colaborador.id
        necesidad_material = validated_data.get('necesidad_material')
        evento = necesidad_material.evento
        colaboraciones = Colaboracion.objects.filter(
            necesidad_material_id=necesidad_material.id)
        suma_colaboraciones_iniciales = 0
        for c in colaboraciones:
            suma_colaboraciones_iniciales += c.cantidad
        if suma_colaboraciones_iniciales == necesidad_material.cantidad:
            send_was_full_colaboracion_mail(necesidad_material)
        new_instance = super().update(instance, validated_data)
        titulo_email = u"Usted ha modificado su colaboración en un Evento. Los nuevos datos son:"
        self.send_colaboracion_email(
            colaborador_id, evento, new_instance, titulo_email)
        colaboraciones = Colaboracion.objects.filter(
            necesidad_material_id=necesidad_material.id)
        suma_colaboraciones = 0
        for c in colaboraciones:
            suma_colaboraciones += c.cantidad
        if suma_colaboraciones == necesidad_material.cantidad:
            send_full_colaboracion_mail(necesidad_material)
        return new_instance

    # la continuacion de la negrada de Gon
    def destroy(self, colaboracion_id):
        colaboracion = Colaboracion.objects.get(id=colaboracion_id)
        if colaboracion is not None:
            colaborador_id = colaboracion.colaborador.id
            necesidad_material = colaboracion.necesidad_material
            evento = necesidad_material.evento
            titulo_email = u"Usted ha cancelado su colaboración en el siguiente Evento:"
            self.send_colaboracion_email(
                colaborador_id, evento, colaboracion, titulo_email)
            colaboraciones = Colaboracion.objects.filter(
                necesidad_material_id=necesidad_material.id)
            suma_colaboraciones = 0
            for c in colaboraciones:
                suma_colaboraciones += c.cantidad
            if suma_colaboraciones == necesidad_material.cantidad:
                send_was_full_colaboracion_mail(necesidad_material)

    def send_colaboracion_email(self, colaborador_id, evento, colaboracion, titulo_email):
        subject_utf = u"Registro de su colaboración en Helpo"
        from common.templates import render_colaboracion_email
        content = render_colaboracion_email(evento, colaboracion, titulo_email)
        from common.notifications import send_mail_to_id
        send_mail_to_id(id_to=colaborador_id,
                        html_subject=subject_utf, html_content=content)


class ConsultaNecesidadSerializer(serializers.ModelSerializer):
    colaboraciones = serializers.SerializerMethodField()
    recurso = RecursoSerializer(read_only=True)
    recurso_id = serializers.PrimaryKeyRelatedField(
        queryset=Recurso.objects.all(), source='recurso', write_only=True
    )

    def get_colaboraciones(self, necesidad):
        queryset = Colaboracion.objects.filter(
            necesidad_material=necesidad, vigente=True)
        serializer = ColaboracionSerializer(instance=queryset, many=True)
        return serializer.data

    class Meta:
        model = Necesidad
        fields = ('id', 'descripcion', 'cantidad',
                  'recurso', 'recurso_id', 'colaboraciones')


class ConsultaAllNecesidadSerializer(serializers.ModelSerializer):
    colaboraciones = ColaboracionSerializer(many=True)
    recurso = RecursoSerializer(read_only=True)
    recurso_id = serializers.PrimaryKeyRelatedField(
        queryset=Recurso.objects.all(), source='recurso', write_only=True
    )

    class Meta:
        model = Necesidad
        fields = ('id', 'descripcion', 'cantidad',
                  'recurso', 'recurso_id', 'colaboraciones')


class ParticipacionSerializer(serializers.ModelSerializer):
    necesidad_voluntario_id = serializers.PrimaryKeyRelatedField(
        queryset=Voluntario.objects.all(), source='necesidad_voluntario'
    )
    colaborador = ColaboradorInfoSerializer(read_only=True)
    presencias = serializers.SerializerMethodField()

    class Meta:
        model = Participacion
        fields = ('id', 'comentario', 'cantidad', 'necesidad_voluntario_id', 'colaborador',
                  'presencias', 'retroalimentacion_voluntario', 'retroalimentacion_ong')

    def get_presencias(self, instance):
        from django.db.models import Sum
        presencias = Presencia.objects.filter(participacion=instance)
        if presencias:
            return presencias.aggregate(Sum('cantidad'))['cantidad__sum']
        return 0

    def create(self, validated_data):
        necesidad_voluntario = validated_data.get('necesidad_voluntario')
        participaciones = Participacion.objects.filter(
            necesidad_voluntario_id=necesidad_voluntario.id, vigente=True)
        cantidad = validated_data.get('cantidad')
        suma_participantes = 0
        for p in participaciones:
            suma_participantes += p.cantidad
        if (suma_participantes + cantidad) <= necesidad_voluntario.cantidad:
            colaborador_id = validated_data['colaborador_id']
            participacion = Participacion.objects.create(
                necesidad_voluntario_id=necesidad_voluntario.id, vigente=True, **validated_data)
            send_previous_mail_evento(
                necesidad_voluntario.evento_id, colaborador_id)
            if (suma_participantes + cantidad) == necesidad_voluntario.cantidad:
                send_full_participacion_mail(necesidad_voluntario)
            return participacion
        else:
            raise serializers.ValidationError()


class ConsultaVoluntarioSerializer(serializers.ModelSerializer):
    participaciones = serializers.SerializerMethodField()
    funcion = FuncionSerializer(read_only=True)
    funcion_id = serializers.PrimaryKeyRelatedField(
        queryset=Funcion.objects.all(), source='funcion', write_only=True
    )

    def get_participaciones(self, voluntario):
        queryset = Participacion.objects.filter(
            necesidad_voluntario=voluntario, vigente=True)
        serializer = ParticipacionSerializer(instance=queryset, many=True)
        return serializer.data

    class Meta:
        model = Voluntario
        fields = ('id', 'descripcion', 'cantidad',
                  'funcion', 'funcion_id', 'participaciones')


class ConsultaAllVoluntarioSerializer(serializers.ModelSerializer):
    participaciones = ParticipacionSerializer(many=True)
    funcion = FuncionSerializer(read_only=True)
    funcion_id = serializers.PrimaryKeyRelatedField(
        queryset=Funcion.objects.all(), source='funcion', write_only=True
    )

    class Meta:
        model = Voluntario
        fields = ('id', 'descripcion', 'cantidad',
                  'funcion', 'funcion_id', 'participaciones')


class PropuestaSerializer(serializers.ModelSerializer):
    empresa = UserSerializer(read_only=True)

    class Meta:
        model = Propuesta
        fields = '__all__'

    def update(self, instance, validated_data):
        new_instance = super().update(instance, validated_data)
        response_propuesta(new_instance)
        if new_instance.aceptado == -1:
            deny_propuesta(new_instance)
        return new_instance


class ConsultaAllNecesidadesSerializer(serializers.ModelSerializer):
    necesidades = ConsultaAllNecesidadSerializer(many=True)
    voluntarios = ConsultaAllVoluntarioSerializer(many=True)
    propuestas = PropuestaSerializer(many=True)

    class Meta:
        model = Evento
        fields = ('id', 'nombre', 'necesidades', 'campaña', 'voluntarios',
                  'fecha_hora_inicio', 'fecha_hora_fin', 'propuestas', 'estado')


class ConsultaNecesidadesSerializer(serializers.ModelSerializer):
    necesidades = ConsultaNecesidadSerializer(many=True)
    voluntarios = ConsultaVoluntarioSerializer(many=True)
    propuestas = PropuestaSerializer(many=True)

    class Meta:
        model = Evento
        fields = ('id', 'nombre', 'campaña', 'necesidades', 'voluntarios',
                  'fecha_hora_inicio', 'fecha_hora_fin', 'propuestas')


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
    propuestas = PropuestaSerializer(many=True)

    class Meta:
        model = Evento
        fields = ('id', 'nombre', 'descripcion', 'fecha_hora_inicio', 'campaña', 'horarios',
            'fecha_hora_fin', 'rubro', 'rubro_id', 'ubicacion', 'contacto', 'organizacion_id',
            'necesidades', 'organizacion', 'voluntarios', 'comentarios', 'estado', 'propuestas')


class PropuestaONGDetalleSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'nombre')


class PropuestaEventoSerializer(serializers.ModelSerializer):

    organizacion = PropuestaONGDetalleSerializer()

    class Meta:
        model = Evento
        fields = ('id', 'nombre', 'organizacion', 'fecha_hora_inicio')


class PropuestaDetalleSerializer(serializers.ModelSerializer):

    evento = PropuestaEventoSerializer()

    class Meta:
        model = Propuesta
        fields = ('id', 'evento', 'aceptado')


class PropuestasEmpresasSerializer(serializers.ModelSerializer):

    propuestas = PropuestaDetalleSerializer(many=True)

    class Meta:
        model = User
        fields = ('id', 'propuestas')


class VoluntarioPropuestaEmpresaSerializer(serializers.ModelSerializer):

    funcion = FuncionSerializer()

    class Meta:
        model = Voluntario
        fields = ('id', 'evento', 'funcion')


class NecesidadPropuestaEmpresaSerializer(serializers.ModelSerializer):

    recurso = RecursoSerializer()

    class Meta:
        model = Necesidad
        fields = ('id', 'evento', 'recurso')


class ColaboracionPropuestaSerializer(serializers.ModelSerializer):

    necesidad_material = NecesidadPropuestaEmpresaSerializer()

    class Meta:
        model = Colaboracion
        fields = '__all__'


class ParticipacionPropuestaSerializer(serializers.ModelSerializer):

    necesidad_voluntario = VoluntarioPropuestaEmpresaSerializer()

    class Meta:
        model = Participacion
        fields = '__all__'


class ConsultarPropuestasEmpresaSerializer(serializers.ModelSerializer):

    participacion = ParticipacionPropuestaSerializer(many=True)
    colaboracion = ColaboracionPropuestaSerializer(many=True)

    class Meta:
        model = User
        fields = ('id', 'nombre', 'participacion', 'colaboracion')


class EventoImagenSerializer(serializers.ModelSerializer):

    class Meta:
        model = EventoImagen
        fields = ('id', 'url', 'evento')
        read_only_fields = ('id',)


class MensajeSerializer(serializers.ModelSerializer):
    evento_id = serializers.PrimaryKeyRelatedField(
        queryset=Evento.objects.all(), source='evento'
    )

    class Meta:
        model = Mensaje
        fields = ('id', 'asunto', 'mensaje', 'evento_id', 'created')

    def create(self, validated_data):
        mensaje = Mensaje.objects.create(**validated_data)
        send_mail_mensaje_evento(mensaje, validated_data.get('evento').id)
        return mensaje
