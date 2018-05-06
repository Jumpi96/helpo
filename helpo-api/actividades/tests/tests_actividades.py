import json, datetime
from rest_framework import status
from django.test import TestCase, Client
from django.urls import reverse
from actividades.models import RubroEvento, Evento, Ubicacion
from actividades.serializers import RubroEventoSerializer

client = Client()

class RubroEventoTests(TestCase):

    def setUp(self):
        self.salud = RubroEvento.objects.create(
            nombre = "Salud"
        )
        self.edu = RubroEvento.objects.create(
            nombre = "Educación"
        )
        
    def test_get_todos(self):
        response = client.get(reverse('get_post_rubro_evento'))
        rubros = RubroEvento.objects.all()
        serializer = RubroEventoSerializer(rubros, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_existente(self):
        response = client.get(
            reverse('get_put_delete_rubro_evento', kwargs={'id': self.salud.id})
        )
        rubro = RubroEvento.objects.get(id=self.salud.id)
        serializer = RubroEventoSerializer(rubro)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_no_existente(self):
        response = client.get(
            reverse('get_put_delete_rubro_evento', kwargs={'id': 30})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class EventoTests(TestCase):

    def setUp(self):
        self.salud = RubroEvento.objects.create(
            nombre = "Salud"
        )        
        self.ubicacion = Ubicacion.objects.create(
            latitud = -10.0,
            longitud = -10.0,
            notas = "Espejo Norte 926"
        )
        self.jornada = Evento.objects.create(
            nombre = "Jornada 28/04/18",
            descripcion = "Esta es una jornada de prueba",
            fecha_hora = datetime.datetime.now(),
            duracion = 120,
            rubro_id = self.salud.id,
            ubicacion = self.ubicacion
        )
        
    def test_get_todos(self):
        response = client.get(reverse('get_post_evento'))
        eventos = Evento.objects.all()
        self.assertEqual(1, len(response.data))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_existente(self):
        response = client.get(
            reverse('get_put_delete_evento', kwargs={'id': self.jornada.id})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_no_existente(self):
        response = client.get(
            reverse('get_put_delete_evento', kwargs={'id': 3})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)