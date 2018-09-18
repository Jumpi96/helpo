from django.shortcuts import render  # noqa
import decouple
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import ListAPIView
from rest_framework.generics import DestroyAPIView
from rest_framework.generics import CreateAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView, RetrieveUpdateAPIView
from knox.models import AuthToken
from django.contrib.auth import get_user_model
from users.models import RubroOrganizacion, OrganizacionProfile, VoluntarioProfile, EmpresaProfile, AppValues, User, DeviceID, Suscripcion
from users.serializers import CreateUserSerializer, UserSerializer, LoginUserSerializer, RubroOrganizacionSerializer, OrganizacionProfileSerializer, VoluntarioProfileSerializer, EmpresaProfileSerializer, VerificationMailSerializer, AppValuesSerializer, DeviceIDSerializer, SuscripcionSerializer, SuscripcionSerializerLista
import time
import requests


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

class UserInfoView(generics.RetrieveAPIView):
    """
    API endpoint para ver informacion de un usuario en particular
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'

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

class OrgProfileCreateReadView(ListCreateAPIView):
    """
    API endpoint para crear o ver todos los perfiles de organización
    """
    queryset = OrganizacionProfile.objects.all()
    serializer_class = OrganizacionProfileSerializer

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

def refreshToken():
  now = time.time()
  last_refresh_reference = AppValues.objects.get(key="imgurLastRefresh")
  last_refresh_time = float(last_refresh_reference.value)

  # Me fijo si paso mas de un dia desde el ultimo refresh (en segundos)
  if (now - last_refresh_time) > 86400:
    refresh_token_reference = AppValues.objects.get(key="imgurRefreshToken")
    access_token_reference = AppValues.objects.get(key="imgurAccessToken")
    postData = {
      'refresh_token': refresh_token_reference.value,
      'client_id': decouple.config('IMGUR_CLIENT_ID'),
      'client_secret': decouple.config('IMGUR_CLIENT_SECRET'),
      'grant_type': 'refresh_token',
    }
    res = requests.post("https://api.imgur.com/oauth2/token", postData)
    new_access_token = res.json()['access_token']
    new_refresh_token = res.json()['refresh_token']

    last_refresh_reference.value = str(now)
    last_refresh_reference.save()
    refresh_token_reference.value = new_refresh_token
    refresh_token_reference.save()
    access_token_reference.value = new_access_token
    access_token_reference.save()
    

class ImgurTokenView(APIView):
  """
  API endpoint para recibir el token de Imgur API
  """
  def get(self, request, format=None):
    refreshToken()
    token = AppValues.objects.get(key="imgurAccessToken")
    serializer = AppValuesSerializer(token)
    return Response(serializer.data)


class DeviceIDCreateReadView(ListCreateAPIView):
    """
    API endpoint para crear o ver todos los dispositivos de usuario
    """
    queryset = DeviceID.objects.all()
    serializer_class = DeviceIDSerializer
    lookup_field = 'player_id'


class DeviceIDReadUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint para leer, actualizar o eliminar un dispositivo de usuario
    """
    queryset = DeviceID.objects.all()
    serializer_class = DeviceIDSerializer
    lookup_field = 'player_id'


class SuscripcionCreateView(CreateAPIView):
    """
    API endpoint para crear o listar todas las suscripciones de un usuario
    """
    queryset = Suscripcion.objects.all()
    serializer_class = SuscripcionSerializer
    lookup_field = 'id'

class SuscripcionDestroyView(DestroyAPIView):
    """
    API endpoint para borrar una suscripcion en particular
    """
    queryset = Suscripcion.objects.all()
    serializer_class = SuscripcionSerializer
    lookup_field = 'id'

class SuscripcionListUserView(APIView):
    """
    API endpoint para listar todos las suscripciones de un usuario
    """   
    def get(self, request, usuario, format=None):
        suscripciones = Suscripcion.objects.filter(usuario=usuario)
        serializer = SuscripcionSerializerLista(suscripciones, many=True)
        return Response(serializer.data)