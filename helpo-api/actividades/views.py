from rest_framework import viewsets
from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from actividades.models import Evento, RubroEvento, Contacto
from actividades.serializers import EventoSerializer, RubroEventoSerializer, ContactoSerializer

class RubroEventoCreateReadView(ListCreateAPIView):
    """
    API endpoint para crear o ver todos los rubros de evento
    """
    queryset = RubroEvento.objects.all()
    serializer_class = RubroEventoSerializer

class ContactoEventoCreateReadView(ListCreateAPIView):
    """
    API endpoint para crear o ver todos los contactos de evento
    """
    queryset = Contacto.objects.all()
    serializer_class = ContactoSerializer

class RubroEventoReadUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint para leer, actualizar o eliminar un rubro de evento
    """
    queryset = RubroEvento.objects.all()
    serializer_class = RubroEventoSerializer
    lookup_field = 'id'

class ContactoEventoReadUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint para leer, actualizar o eliminar un contacto de evento
    """
    queryset = Contacto.objects.all()
    serializer_class = ContactoSerializer
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