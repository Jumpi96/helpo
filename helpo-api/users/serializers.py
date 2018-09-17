from rest_framework import serializers
from django.contrib.auth import authenticate
from users.models import User, RubroOrganizacion, OrganizacionProfile, Ubicacion, Imagen, VoluntarioProfile, EmpresaProfile, UserVerification, AppValues, DeviceID, Suscripcion
from django.core.exceptions import ObjectDoesNotExist


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

class ImagenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Imagen
        fields = ('id', 'url')

class OrganizacionProfileSerializer(serializers.ModelSerializer):
    rubro = RubroOrganizacionSerializer(required=False)
    ubicacion = UbicacionSerializer(required=False)
    avatar = ImagenSerializer(required=False)
    usuario = UserSerializer(read_only=True)

    class Meta:
        model = OrganizacionProfile
        fields = ('verificada', 'telefono', 'cuit', 'descripcion', 'rubro', 'avatar', 'ubicacion', 'usuario')
        read_only_fields = ('usuario','verificada')

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

class EmpresaProfileSerializer(serializers.ModelSerializer):
    rubro = RubroOrganizacionSerializer(required=False)
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

class VoluntarioProfileSerializer(serializers.ModelSerializer):
    avatar = ImagenSerializer(required=False)   
    usuario = UserSerializer(read_only=True) 

    class Meta:
        model = VoluntarioProfile
        fields = ( 'telefono', 'apellido', 'dni', 'sexo', 'gustos', 'habilidades', 'avatar', 'usuario')
        read_only_fields = ('usuario',)

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