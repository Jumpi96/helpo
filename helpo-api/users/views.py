from django.shortcuts import render  # noqa
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView, RetrieveUpdateAPIView
from knox.models import AuthToken
from django.contrib.auth import get_user_model
from users.models import RubroOrganizacion, OrganizacionProfile, VoluntarioProfile, EmpresaProfile
from users.serializers import CreateUserSerializer, UserSerializer, LoginUserSerializer, RubroOrganizacionSerializer, OrganizacionProfileSerializer, VoluntarioProfileSerializer, EmpresaProfileSerializer, VerificationMailSerializer


class CreateUserView(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)
        })

class LoginView(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user =  serializer.validated_data
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)
        })

class UserView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class RubroOrganizacionCreateReadView(ListCreateAPIView):
    """
    API endpoint para crear o ver todos los rubros de organización
    """
    queryset = RubroOrganizacion.objects.all()
    serializer_class = RubroOrganizacionSerializer

class RubroOrganizacionReadUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint para leer, actualizar o eliminar un rubro de organización
    """
    queryset = RubroOrganizacion.objects.all()
    serializer_class = RubroOrganizacionSerializer
    lookup_field = 'id'

class OrgProfileReadUpdateDeleteView(RetrieveUpdateAPIView):
    """
    API endpoint para leer, actualizar o eliminar un perfil de organizacion
    """
    queryset = OrganizacionProfile.objects.all()
    serializer_class = OrganizacionProfileSerializer
    lookup_field = 'usuario'

class EmpresaProfileReadUpdateDeleteView(RetrieveUpdateAPIView):
    """
    API endpoint para leer, actualizar o eliminar un perfil de empresa
    """
    queryset = EmpresaProfile.objects.all()
    serializer_class = EmpresaProfileSerializer
    lookup_field = 'usuario'

class VoluntarioProfileReadUpdateDeleteView(RetrieveUpdateAPIView):
    """
    API endpoint para leer, actualizar o eliminar un perfil de voluntario
    """
    queryset = VoluntarioProfile.objects.all()
    serializer_class = VoluntarioProfileSerializer
    lookup_field = 'usuario'

class VerifyMailView(generics.GenericAPIView):
    serializer_class = VerificationMailSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            return Response({
                "verification": "Success"
             })
        return Response({
            "verification": "Failed"
        })