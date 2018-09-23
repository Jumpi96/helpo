from rest_framework import serializers
from django.contrib.auth import authenticate
from users.models import User, UserWrapper, RubroOrganizacion, RubroEmpresa, OrganizacionProfile, Ubicacion, Imagen, VoluntarioProfile, EmpresaProfile, UserVerification, AppValues, DeviceID, Suscripcion
from actividades.models import Participacion, Evento, Colaboracion
from django.core.exceptions import ObjectDoesNotExist
from common.functions import get_datos_token_google, get_datos_token_facebook
from hashlib import sha256


class GoogleAuthSerializer(serializers.ModelSerializer):
    apellido = serializers.CharField(max_length=50, allow_null=True)

    class Meta:
        model = UserWrapper
        fields = ('nombre','email','password','user_type','apellido','id_token')
        write_only_fields = ('apellido')

    def validate(self, data):
        if data:
            token = data.get('id_token')
            datos_google = get_datos_token_google(token)
            if datos_google:
                user_email = datos_google.get('email')
                if user_email:
                    user_qs = User.objects.filter(email=user_email)
                    if len(user_qs) == 0:
                        email_encoded = user_email.encode('utf-8')
                        user_password = str(sha256(email_encoded))[:64]
                        kwargs = {'avatar': datos_google.get(
                            'foto'), 'apellido': datos_google.get('apellido')}
                        user = User.objects.create_user(user_email, datos_google.get('nombre'), user_password, data.get(
                            'user_type'), **kwargs)
                        return user
                    else:
                        user = user_qs.first()
                        return user
        raise serializers.ValidationError("Unable to log in with provided Google Token")

class FacebookAuthSerializer(GoogleAuthSerializer):
    def validate(self, data):
        if data:
            token = data.get('id_token')
            user_name = get_datos_token_facebook(token)
            if user_name:
                user_email = data.get('email')
                if user_email:
                    user_qs = User.objects.filter(email=user_email)
                    if len(user_qs) == 0:
                        word_list = user_name.split()
                        nombre = word_list[0]
                        apellido = word_list[-1]
                        email_encoded = user_email.encode('utf-8')
                        password = str(sha256(email_encoded))[:64]
                        kwargs = {'apellido': apellido}
                        user = User.objects.create_user(user_email, nombre, password, data.get(
                            'user_type'), **kwargs)
                        return user
                    else:
                        user = user_qs.first()
                        return user
        raise serializers.ValidationError("Unable to log in with provided Facebook Token")


class CreateUserSerializer(serializers.ModelSerializer):
    apellido = serializers.CharField(max_length=50, allow_null=True)

    class Meta:
        model = User
        fields = ('nombre','email','password','user_type','apellido')
        write_only_fields = ('apellido')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class LoginUserSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials")

class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'email', 'user_type', 'is_confirmed', 'nombre', 'avatar')

    def get_avatar(self, obj):
        if obj.user_type == 1:
            perfil = OrganizacionProfile.objects.filter(usuario=obj.id).first()
            return perfil.avatar.url
        elif obj.user_type == 2:
            perfil = VoluntarioProfile.objects.filter(usuario=obj.id).first()
            return perfil.avatar.url
        elif obj.user_type == 3:
            perfil = EmpresaProfile.objects.filter(usuario=obj.id).first()
            return perfil.avatar.url


## TODO: Ver de no repetir UbicacionSerializer del de actividades
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

class RubroOrganizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RubroOrganizacion
        fields = ('id', 'nombre')

class RubroEmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = RubroEmpresa
        fields = ('id', 'nombre')

class ImagenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Imagen
        fields = ('id', 'url')

class OrganizacionProfileSerializer(serializers.ModelSerializer):
    rubro = RubroOrganizacionSerializer(required=False)
    ubicacion = UbicacionSerializer(required=False)
    avatar = ImagenSerializer(required=False)
    usuario = UserSerializer(read_only=True)
    manos = serializers.SerializerMethodField()
    eventos = serializers.SerializerMethodField()

    class Meta:
        model = OrganizacionProfile
        fields = ('verificada', 'telefono', 'cuit', 'descripcion', 'rubro', 'avatar', 'ubicacion', 'usuario','manos','eventos')
        read_only_fields = ('usuario','verificada','manos','eventos')

    def update(self, instance, validated_data):
        rubro_data = None
        avatar_data = None
        ubicacion_data = None

        try:
            rubro_data = validated_data.pop('rubro')
        except KeyError:
            # Repito asginar None porque python me hace poner algo en la excepcion
            rubro_data = None

        try:
            avatar_data = validated_data.pop('avatar')
        except KeyError:
            avatar_data = None

        try:
            ubicacion_data = validated_data.pop('ubicacion')
        except KeyError:       
            ubicacion_data = None

        instance.telefono = validated_data.get('telefono', instance.telefono)
        instance.cuit = validated_data.get('cuit', instance.cuit)
        instance.descripcion = validated_data.get('descripcion', instance.descripcion) 

        if rubro_data != None:
            nuevoRubro = RubroOrganizacion.objects.get(nombre=rubro_data["nombre"])
            instance.rubro = nuevoRubro       
        
        if ubicacion_data != None:
            nuevaUbicacion = Ubicacion(**ubicacion_data)           
            nuevaUbicacion.save()
            instance.ubicacion = nuevaUbicacion        

        #TODO: Ver si hay que cambiar cuando se haga mejor manejo de imagenes
        if avatar_data != None:
            try:    
                nuevaImagen = Imagen.objects.get(url=avatar_data["url"])
                instance.avatar = nuevaImagen
            except Exception: # Imagen.DoesNotExist
                ## TODO: Sacar isExternal hardcodeado
                nuevaImagen = Imagen(**avatar_data, isExternal=False)
                nuevaImagen.save()
                instance.avatar = nuevaImagen
        instance.save()
        return instance

    def get_manos(self, obj):
        participaciones = Participacion.objects.filter(retroalimentacion_ong=True).filter(necesidad_voluntario__evento__organizacion_id=obj.usuario_id).count()
        colaboraciones = Colaboracion.objects.filter(retroalimentacion_ong=True).filter(necesidad_material__evento__organizacion_id=obj.usuario_id).count()
        manos = participaciones + colaboraciones
        return manos

    def get_eventos(self, obj):
        eventos = Evento.objects.filter(organizacion_id=obj.usuario_id).count()
        return eventos

class EmpresaProfileSerializer(serializers.ModelSerializer):
    rubro = RubroEmpresaSerializer(required=False)
    ubicacion = UbicacionSerializer(required=False)
    avatar = ImagenSerializer(required=False)    
    usuario = UserSerializer(read_only=True)

    class Meta:
        model = EmpresaProfile
        fields = ( 'telefono', 'cuit', 'descripcion', 'rubro', 'avatar', 'ubicacion', 'usuario')
        read_only_fields = ('usuario',)

    def update(self, instance, validated_data):
        rubro_data = None
        avatar_data = None
        ubicacion_data = None

        try:
            rubro_data = validated_data.pop('rubro')
        except KeyError:
            # Repito asginar None porque python me hace poner algo en la excepcion
            rubro_data = None

        try:
            avatar_data = validated_data.pop('avatar')
        except KeyError:
            avatar_data = None

        try:
            ubicacion_data = validated_data.pop('ubicacion')
        except KeyError:       
            ubicacion_data = None

        instance.telefono = validated_data.get('telefono', instance.telefono)
        instance.cuit = validated_data.get('cuit', instance.cuit)
        instance.descripcion = validated_data.get('descripcion', instance.descripcion) 

        if rubro_data != None:
            nuevoRubro = RubroEmpresa.objects.get(nombre=rubro_data["nombre"])
            instance.rubro = nuevoRubro       
        
        if ubicacion_data != None:
            nuevaUbicacion = Ubicacion(**ubicacion_data)           
            nuevaUbicacion.save()
            instance.ubicacion = nuevaUbicacion        

        #TODO: Ver si hay que cambiar cuando se haga mejor manejo de imagenes
        if avatar_data != None:
            try:    
                nuevaImagen = Imagen.objects.get(url=avatar_data["url"])
                instance.avatar = nuevaImagen
            except Exception: # Imagen.DoesNotExist
                ## TODO: Sacar isExternal hardcodeado
                nuevaImagen = Imagen(**avatar_data, isExternal=False)
                nuevaImagen.save()
                instance.avatar = nuevaImagen
        instance.save()
        return instance

class VoluntarioProfileSerializer(serializers.ModelSerializer):
    avatar = ImagenSerializer(required=False)   
    usuario = UserSerializer(read_only=True) 
    manos = serializers.SerializerMethodField()
    eventos = serializers.SerializerMethodField()

    class Meta:
        model = VoluntarioProfile
        fields = ( 'telefono', 'apellido', 'dni', 'sexo', 'gustos', 'habilidades', 'avatar', 'usuario','manos','eventos')
        read_only_fields = ('usuario','manos','eventos')

    def update(self, instance, validated_data):
        avatar_data = None
        
        try:
            avatar_data = validated_data.pop('avatar')
        except KeyError:
            avatar_data = None

        instance.telefono = validated_data.get('telefono', instance.telefono)
        instance.apellido = validated_data.get('apellido', instance.apellido)
        instance.dni = validated_data.get('dni', instance.dni)
        instance.sexo = validated_data.get('sexo', instance.sexo)         
        instance.gustos = validated_data.get('gustos', instance.gustos)         
        instance.habilidades = validated_data.get('habilidades', instance.habilidades)    

        #TODO: Ver si hay que cambiar cuando se haga mejor manejo de imagenes
        if avatar_data != None:
            try:    
                nuevaImagen = Imagen.objects.get(url=avatar_data["url"])
                instance.avatar = nuevaImagen
            except Exception: # Imagen.DoesNotExist
                ## TODO: Sacar isExternal hardcodeado
                nuevaImagen = Imagen(**avatar_data, isExternal=False)
                nuevaImagen.save()
                instance.avatar = nuevaImagen
        instance.save()
        return instance

    def get_manos(self, obj):
        participaciones = Participacion.objects.filter(retroalimentacion_voluntario=True).filter(colaborador_id=obj.usuario_id).count()
        colaboraciones = Colaboracion.objects.filter(retroalimentacion_voluntario=True).filter(colaborador_id=obj.usuario_id).distinct('necesidad_material__evento').count()
        manos = participaciones + colaboraciones
        return manos

    def get_eventos(self, obj):
        cantidad = []
        participaciones = Participacion.objects.filter(colaborador_id=obj.usuario_id)
        colaboraciones = Colaboracion.objects.filter(colaborador_id=obj.usuario_id).distinct('necesidad_material__evento')
        for c in colaboraciones:
            if c.necesidad_material.evento_id not in cantidad:
                cantidad.append(c.necesidad_material.evento_id)
        for p in participaciones:
            if p.necesidad_voluntario.evento_id not in cantidad:
                cantidad.append(p.necesidad_voluntario.evento_id)
        eventos = Evento.objects.filter(id__in = cantidad).count()
        return eventos    
        
class VerificationMailSerializer(serializers.Serializer):    
    token = serializers.CharField()

    def validate(self, data):
        print(data)
        try:
            user_verification = UserVerification.objects.get(verificationToken=data["token"])
            user = user_verification.usuario
            if user.validate_mail(user_verification.verificationToken):
                return True
        except ObjectDoesNotExist:
            raise serializers.ValidationError("Verification token does not match any")

class AppValuesSerializer(serializers.ModelSerializer):
  class Meta:
        model = AppValues
        fields = ('key', 'value')

# Colaborador refiere a voluntario o empresa que colabora/participa en la actividad social.
class ColaboradorInfoSerializer(serializers.ModelSerializer):
    identificador = serializers.SerializerMethodField() # Número de DNI o CUIT
    apellido = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'nombre', 'identificador', 'apellido')

    def get_apellido(self, obj):
        if obj.user_type != 3:
            return VoluntarioProfile.objects.get(usuario=obj.id).apellido
    
    def get_identificador(self, obj):
        if obj.user_type == 3:
            return EmpresaProfile.objects.get(usuario=obj.id).cuit
        else:
            return VoluntarioProfile.objects.get(usuario=obj.id).dni
            

class DeviceIDSerializer(serializers.ModelSerializer):

    class Meta:
        model = DeviceID
        fields = ('player_id', 'email')


class SuscripcionSerializer(serializers.ModelSerializer):   

    class Meta:
        model = Suscripcion
        fields = ('id', 'usuario', 'organizacion')

class SuscripcionSerializerLista(serializers.ModelSerializer):   
    
    usuario = UserSerializer()
    organizacion = UserSerializer()

    class Meta:
        model = Suscripcion
        fields = ('id', 'usuario', 'organizacion')