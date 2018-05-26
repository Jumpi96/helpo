from django.shortcuts import render  # noqa
from rest_framework.generics import CreateAPIView
from django.contrib.auth import get_user_model
from users.serializers import UserSerializer


class CreateUserView(CreateAPIView):
    model = get_user_model()
    serializer_class = UserSerializer