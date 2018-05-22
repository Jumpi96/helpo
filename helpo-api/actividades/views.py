from rest_framework import viewsets
from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from actividades.models import Evento, RubroEvento, CategoriaRecurso, Recurso, Necesidad
from actividades.serializers import EventoSerializer, RubroEventoSerializer, \
    CategoriaRecursoSerializer, RecursoSerializer, NecesidadSerializer

class RubroEventoCreateReadView(ListCreateAPIView):
    """
    API endpoint para crear o ver todos los rubros de evento
    """
    queryset = RubroEvento.objects.all()
    serializer_class = RubroEventoSerializer

class RubroEventoReadUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint para leer, actualizar o eliminar un rubro de evento
    """
    queryset = RubroEvento.objects.all()
    serializer_class = RubroEventoSerializer
    lookup_field = 'id'


class EventoCreateReadView(ListCreateAPIView):
    """
    API endpoint para crear o ver todos los eventos
    """
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer

class EventoReadUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint para leer, actualizar o eliminar un evento
    """
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    lookup_field = 'id'

class CategoriaRecursoCreateReadView(ListCreateAPIView):
    """
    API endpoint para crear o ver todas las categorías de recurso
    """
    queryset = CategoriaRecurso.objects.all()
    serializer_class = CategoriaRecursoSerializer

class CategoriaRecursoReadUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint para leer, actualizar o eliminar una categoría de recurso
    """
    queryset = CategoriaRecurso.objects.all()
    serializer_class = CategoriaRecursoSerializer
    lookup_field = 'id'

class RecursoCreateReadView(ListCreateAPIView):
    """
    API endpoint para crear o ver todos los recursos
    """
    queryset = Recurso.objects.all()
    serializer_class = RecursoSerializer

class RecursoReadUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint para leer, actualizar o eliminar un recurso
    """
    queryset = Recurso.objects.all()
    serializer_class = RecursoSerializer
    lookup_field = 'id'

class NecesidadCreateReadView(ListCreateAPIView):
    """
    API endpoint para crear o ver todas las necesidades
    """
    queryset = Necesidad.objects.all()
    serializer_class = NecesidadSerializer

class NecesidadReadUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint para leer, actualizar o eliminar una necesidad
    """
    queryset = Necesidad.objects.all()
    serializer_class = NecesidadSerializer
    lookup_field = 'id'