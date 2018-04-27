import json, datetime
from rest_framework import status
from django.test import TestCase, Client
from django.urls import reverse
from actividades.models import TipoDeOrganizacion, Organizacion, Actividad
from actividades.serializers import TipoDeOrganizacionSerializer, OrganizacionSerializer

client = Client()

class TipoDeOrganizacionTests(TestCase):

    def setUp(self):
        self.ddhh = TipoDeOrganizacion.objects.create(
            nombre = "Defensa de los DDHH"
        )
        self.peta = TipoDeOrganizacion.objects.create(
            nombre = "Defensa de los animales"
        )
        
    def test_get_todos(self):
        response = client.get(reverse('get_post_tipo_de_organizacion'))
        tipos = TipoDeOrganizacion.objects.all()
        serializer = TipoDeOrganizacionSerializer(tipos, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_existente(self):
        response = client.get(
            reverse('get_put_delete_tipo_de_organizacion', kwargs={'id': self.ddhh.id})
        )
        tipo = TipoDeOrganizacion.objects.get(id=self.ddhh.id)
        serializer = TipoDeOrganizacionSerializer(tipo)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_no_existente(self):
        response = client.get(
            reverse('get_put_delete_tipo_de_organizacion', kwargs={'id': 3})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class OrganizacionTests(TestCase):

    def setUp(self):
        self.ddhh = TipoDeOrganizacion.objects.create(
            nombre = "Defensa de los DDHH"
        )
        self.ai = Organizacion.objects.create(
            nombre = "Amnistía Internacional",
            tipo_id = self.ddhh.id
        )
        self.madres = Organizacion.objects.create(
            nombre = "Madres",
            tipo_id = self.ddhh.id
        )
        
    def test_get_todos(self):
        response = client.get(reverse('get_post_organizacion'))
        organizaciones = Organizacion.objects.all()
        self.assertEqual(2, len(response.data))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_existente(self):
        response = client.get(
            reverse('get_put_delete_organizacion', kwargs={'id': self.ai.id})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_no_existente(self):
        response = client.get(
            reverse('get_put_delete_organizacion', kwargs={'id': 3})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class ActividadTests(TestCase):

    def setUp(self):
        self.ddhh = TipoDeOrganizacion.objects.create(
            nombre = "Defensa de los DDHH"
        )
        self.ai = Organizacion.objects.create(
            nombre = "Amnistía Internacional",
            tipo_id = self.ddhh.id
        )
        self.jornada = Actividad.objects.create(
            nombre = "Jornada 28/04/18",
            fecha = datetime.datetime.now(),
            organizacion_id = self.ai.id
        )
        
    def test_get_todos(self):
        response = client.get(reverse('get_post_actividad'))
        actividades = Organizacion.objects.all()
        self.assertEqual(1, len(response.data))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_existente(self):
        response = client.get(
            reverse('get_put_delete_actividad', kwargs={'id': self.jornada.id})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_no_existente(self):
        response = client.get(
            reverse('get_put_delete_actividad', kwargs={'id': 3})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)