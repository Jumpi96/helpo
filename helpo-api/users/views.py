from django.shortcuts import render  # noqa
import decouple
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core import serializers
from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import ListAPIView
from rest_framework.generics import DestroyAPIView
from rest_framework.generics import CreateAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView, RetrieveUpdateAPIView
from knox.models import AuthToken
from django.db.models import Value as V
from django.db.models.functions import Concat
from django.contrib.auth import get_user_model
from users.models import OrganizationArea, RubroEmpresa, OrganizacionProfile, EmpresaProfile, AppValues, User, DeviceID, Suscripcion, VolunteerProfile, Skill, State, Modality
from users.serializers import FacebookAuthSerializer, GoogleAuthSerializer, CreateUserSerializer, UserSerializer, LoginUserSerializer, ChangePasswordSerializer, ResetPasswordSerializer, OrganizationAreaSerializer, RubroEmpresaSerializer, OrganizacionProfileSerializer, EmpresaProfileSerializer, VerificationMailSerializer, SendVerificationEmailSerializer, VerificationSmsSerializer, AppValuesSerializer, DeviceIDSerializer, SuscripcionSerializer, SuscripcionSerializerLista, VolunteerProfileSerializer, SkillSerializer, StateSerializer, ModalitySerializer
import time
import requests
from users.services import send_confirmation_sms


class GoogleExistsView(generics.GenericAPIView):
    serializer_class = GoogleAuthSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.exists(request.data):
            return Response(serializer.initial_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

class FacebookExistsView(GoogleExistsView):
    serializer_class = FacebookAuthSerializer

class GoogleAuthView(generics.GenericAPIView):
    serializer_class = GoogleAuthSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        user = serializer.validate(request.data)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)
        })

class FacebookAuthView(GoogleAuthView):
    serializer_class = FacebookAuthSerializer

class CreateUserView(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        if user.user_type not in [1, 2]:
            return Response({"error": "No se puede crear este tipo de usuario."}, status=status.HTTP_403_FORBIDDEN)
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
        if not user.is_confirmed:
            return Response({
                "user": UserSerializer(user, context=self.get_serializer_context()).data
            }, status=status.HTTP_406_NOT_ACCEPTABLE)
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

class OrganizationAreaCreateReadView(ListCreateAPIView):
    """
    API endpoint para crear o ver todos los rubros de organización
    """
    queryset = OrganizationArea.objects.all()
    serializer_class = OrganizationAreaSerializer

class OrganizationAreaReadUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint para leer, actualizar o eliminar un rubro de organización
    """
    queryset = OrganizationArea.objects.all()
    serializer_class = OrganizationAreaSerializer
    lookup_field = 'id'

class RubroEmpresaCreateReadView(ListCreateAPIView):
    """
    API endpoint para crear o ver todos los rubros de empresa
    """
    queryset = RubroEmpresa.objects.all()
    serializer_class = RubroEmpresaSerializer

class RubroEmpresaReadUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint para leer, actualizar o eliminar un rubro de empresa
    """
    queryset = RubroEmpresa.objects.all()
    serializer_class = RubroEmpresaSerializer
    lookup_field = 'id'

class EmpresaProfileReadView(ListAPIView):
    """
    API endpoint para ver todos los perfiles de empresa
    """
    queryset = EmpresaProfile.objects.all()
    serializer_class = EmpresaProfileSerializer

class OrgProfileCreateReadView(ListCreateAPIView):
    """
    API endpoint para crear o ver todos los perfiles de organización
    """
    queryset = OrganizacionProfile.objects.all().exclude(usuario__email__regex=r'@machine\.com')
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

class VolunteerProfileCreateReadView(ListCreateAPIView):
    """
    API endpoint para crear o ver todos los perfiles de voluntarios
    """
    serializer_class = VolunteerProfileSerializer

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        limit = min(int(request.query_params.get('limit', 10), 1000))
        offset = int(request.query_params.get('offset', 0))
        return Response({
            'data': [VolunteerProfileSerializer(p).data for p in queryset[offset:offset+limit]],
            'total': len(queryset),
            'offset': offset,
            'limit': limit
        })


    def get_queryset(self):
        queryset = VolunteerProfile.objects.filter(usuario__is_confirmed=True)
        if self.tiene_filtros(self.request.query_params):
            lista_voluntarios = self.get_voluntarios(self.request.query_params, queryset)
            queryset = queryset.filter(id__in=lista_voluntarios)
        queryset = queryset.order_by('id').reverse()
        return queryset

    def get_voluntarios(self, params, queryset):
        interests = params.get('interests', None)
        if interests is not None:
            interests = interests.split(',')
            queryset = queryset.filter(interests__in=interests)
        skills = params.get('skills', None)
        if skills is not None:
            skills = skills.split(',')
            queryset = queryset.filter(skills__in=skills)
        modalities = params.get('modalities', None)
        if modalities is not None:
            modalities = modalities.split(',')
            queryset = queryset.filter(modality_id__in=modalities)
        states = params.get('states', None)
        if states is not None:
            states = states.split(',')
            queryset = queryset.filter(state_id__in=states)
        name = params.get('name', None)
        if name is not None:
            queryset = queryset \
                .annotate(full_name=Concat('usuario__nombre', V(' '), 'last_name')) \
                .filter(full_name__icontains=name)
        return queryset

    def tiene_filtros(self, params):
        filtros = ['interests', 'skills', 'modalities', 'states', 'name']
        for f in filtros:
            if f in params:
                return True
        return False

class VolunteerProfileReadUpdateDeleteView(RetrieveUpdateAPIView):	
    """	
    API endpoint para leer, actualizar o eliminar un perfil de voluntario	
    """	
    queryset = VolunteerProfile.objects.all()	
    serializer_class = VolunteerProfileSerializer	
    lookup_field = 'usuario'

class SendSmsOrganizacionView(APIView):
    """
    API endpoint para leer un perfil de organizacion y enviar sms
    """
    def get(self, request, usuario, format=None):
        try:
            user = int(usuario)
            perfil_organizacion = OrganizacionProfile.objects.filter(usuario=user).first()
            send_confirmation_sms(perfil_organizacion)
            serializer = OrganizacionProfileSerializer(perfil_organizacion, many=False)
            return Response(serializer.data)
        except ValueError:
            return Response(None, status=status.HTTP_404_NOT_FOUND)

class SendSmsEmpresaView(APIView):
    """
    API endpoint para leer un perfil de empresa y enviar sms
    """
    def get(self, request, usuario, format=None):
        try:
            user = int(usuario)
            perfil_empresa = EmpresaProfile.objects.filter(usuario=user).first()
            send_confirmation_sms(perfil_empresa)
            serializer = EmpresaProfileSerializer(perfil_empresa, many=False)
            return Response(serializer.data)
        except ValueError:
            return Response(None, status=status.HTTP_404_NOT_FOUND)

class VerifySmsView(generics.GenericAPIView):
    serializer_class = VerificationSmsSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            return Response({
                "verification": "Success"
             }, status=status.HTTP_200_OK)
        return Response({
            "verification": "Failed"
        }, status=status.HTTP_404_NOT_FOUND)

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

class SendVerificationEmailView(generics.GenericAPIView):
    serializer_class = SendVerificationEmailSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            return Response({
                "email_sending": "Success"
             }, status=status.HTTP_200_OK)
        return Response({
            "email_sending": "Failed"
        }, status=status.HTTP_404_NOT_FOUND)

class ChangePasswordView(generics.GenericAPIView):
    serializer_class = ChangePasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        from common.functions import get_token_user
        request_user = User.objects.filter(id=get_token_user(self.request)).first()
        user = serializer.validate(request.data, request_user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)
        }, status=status.HTTP_200_OK)

class ResetPasswordView(generics.GenericAPIView):
    serializer_class = ResetPasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            return Response({
                "password_reset": "Success"
             }, status=status.HTTP_200_OK)
        return Response({
            "password_reset": "Failed"
        }, status=status.HTTP_404_NOT_FOUND)

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

class SkillCreateReadView(ListCreateAPIView):
    """
    API endpoint to create and view all the skills
    """
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

class StateCreateReadView(ListCreateAPIView):
    """
    API endpoint to create and view all the states
    """
    queryset = State.objects.all()
    serializer_class = StateSerializer

class ModalityCreateReadView(ListCreateAPIView):
    """
    API endpoint to create and view all the modalities
    """
    queryset = Modality.objects.all()
    serializer_class = ModalitySerializer