from rest_framework import serializers
from django.contrib.auth import authenticate
from users.models import User, RubroOrganizacion, OrganizacionProfile, Ubicacion, Imagen


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
    class Meta:
        model = User
        fields = ('id', 'email')

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
        print(instance)
        instance.save()
        return instance
