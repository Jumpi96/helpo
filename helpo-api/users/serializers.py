from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.managers import UserManager

UserModel = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    apellido = serializers.CharField(max_length=50, allow_null=True)

    class Meta:
        model = get_user_model()
        fields = ('nombre','email','password','user_type','apellido')
        write_only_fields = ('apellido')

    def create(self, validated_data):
        return UserManager.create_user(validated_data)