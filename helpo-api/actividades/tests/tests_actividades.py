import json
from rest_framework import status
from django.test import TestCase, Client
from django.urls import reverse
from actividades.models import TipoDeOrganizacion
from actividades.serializers import TipoDeOrganizacionSerializer

client = Client()

class TipoDeOrganizacionTests(TestCase):

    def setUp(self):
        TipoDeOrganizacion.objects.create(
            nombre = "Defensa de los DDHH"
        )
        TipoDeOrganizacion.objects.create(
            nombre = "Defensa de lo s animales"
        )
        
    def test_get_all(self):
        response = client.get(reverse('tipos_de_organizaciones'))
        tipos = TipoDeOrganizacion.objects.all()
        serializer = TipoDeOrganizacionSerializer(tipos, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)