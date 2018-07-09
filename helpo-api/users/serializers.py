from rest_framework import serializers
from django.contrib.auth import authenticate
from users.models import User, UserVerification
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
    class Meta:
        model = User
        fields = ('id', 'email')

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


    
