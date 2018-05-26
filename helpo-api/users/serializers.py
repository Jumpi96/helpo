from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.managers import UserManager

UserModel = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()

    def create(self, validated_data):
        return UserManager.create_user(validated_data)
    
    #TODO: def update