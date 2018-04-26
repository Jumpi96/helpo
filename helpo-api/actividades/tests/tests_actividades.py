import json
from rest_framework import status
from django.test import TestCase, Client
from django.urls import reverse
from actividades.models import TipoDeOrganizacion
from actividades.serializers import TipoDeOrganizacionSerializer

client = Client()

class TipoDeOrganizacionTests(TestCase):

    def setUp(self):
        self.ddhh = TipoDeOrganizacion.objects.create(
            nombre = "Defensa de los DDHH"
        )
        self.peta = TipoDeOrganizacion.objects.create(
            nombre = "Defensa de los animales"
        )
        
    def test_get_all(self):
        response = client.get(reverse('tipos_de_organizaciones'))
        tipos = TipoDeOrganizacion.objects.all()
        serializer = TipoDeOrganizacionSerializer(tipos, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_existente(self):
        response = client.get(
            reverse('tipo_de_organizacion', kwargs={'id': self.ddhh.id})
        )
        tipo = TipoDeOrganizacion.objects.get(id=self.ddhh.id)
        serializer = TipoDeOrganizacionSerializer(tipo)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_no_existente(self):
        response = client.get(
            reverse('tipo_de_organizacion', kwargs={'id': 3})
        )
        tipo = TipoDeOrganizacion.objects.get(id=self.ddhh.id)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)