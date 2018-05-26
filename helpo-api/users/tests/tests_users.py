import json, datetime
from django.utils import timezone
from rest_framework import status
from django.test import TestCase, Client
from django.urls import reverse
from users.models import User
from users.managers import UserManager
from users.serializers import UserSerializer

client = Client()
'''
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
            fecha_hora_inicio = timezone.now(),
            fecha_hora_fin = timezone.now(),
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

class CategoriaRecursoTests(TestCase):

    def setUp(self):
        self.ropa = CategoriaRecurso.objects.create(
            nombre = "Ropa"
        )
        self.juguetes = CategoriaRecurso.objects.create(
            nombre = "Juguetes"
        )
        
    def test_get_todos(self):
        response = client.get(reverse('get_post_categoria_recurso'))
        categorias = CategoriaRecurso.objects.all()
        serializer = CategoriaRecursoSerializer(categorias, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_existente(self):
        response = client.get(
            reverse('get_put_delete_categoria_recurso', kwargs={'id': self.ropa.id})
        )
        categoria = CategoriaRecurso.objects.get(id=self.ropa.id)
        serializer = CategoriaRecursoSerializer(categoria)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_no_existente(self):
        response = client.get(
            reverse('get_put_delete_categoria_recurso', kwargs={'id': 30})
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
            fecha_hora_inicio = timezone.now(),
            fecha_hora_fin = timezone.now(),
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

class RecursoTests(TestCase):

    def setUp(self):
        self.ropa = CategoriaRecurso.objects.create(
            nombre = "Ropa"
        )
        self.sweater = Recurso.objects.create(
            categoria_id = self.ropa.id,
            nombre = "Sweater"
        )
        
    def test_get_todos(self):
        response = client.get(reverse('get_post_recurso'))
        recursos = Recurso.objects.all()
        serializer = RecursoSerializer(recursos, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_existente(self):
        response = client.get(
            reverse('get_put_delete_recurso', kwargs={'id': self.ropa.id})
        )
        recurso = Recurso.objects.get(id=self.ropa.id)
        serializer = RecursoSerializer(recurso)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_no_existente(self):
        response = client.get(
            reverse('get_put_delete_recurso', kwargs={'id': 30})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class NecesidadTests(TestCase):

    def setUp(self):
        self.evento = Evento.objects.create(
            nombre = "Jornada 28/04/18",
            descripcion = "Esta es una jornada de prueba",
            fecha_hora_inicio = timezone.now(),
            fecha_hora_fin = timezone.now(),
        )
        self.ropa = CategoriaRecurso.objects.create(
            nombre = "Sweater"
        )
        self.sweater = Recurso.objects.create(
            categoria_id = self.ropa.id,
            nombre = "Sweater"
        )
        self.necesito = Necesidad.objects.create(
            recurso_id = self.sweater.id,
            cantidad = 1,
            evento_id = self.evento.id,
            descripcion = "Tiene que ser rojo"
        )
        
    def test_get_todos(self):
        response = client.get(reverse('get_post_necesidad'))
        necesidades = Necesidad.objects.all()
        serializer = NecesidadSerializer(necesidades, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_existente(self):
        response = client.get(
            reverse('get_put_delete_necesidad', kwargs={'id': self.necesito.id})
        )
        necesidad = Necesidad.objects.get(id=self.necesito.id)
        serializer = NecesidadSerializer(necesidad)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_no_existente(self):
        response = client.get(
            reverse('get_put_delete_necesidad', kwargs={'id': 30})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
'''