from rest_framework import viewsets
from rest_framework.generics import ListCreateAPIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from actividades.models import Evento, Organizacion, TipoDeOrganizacion
from actividades.serializers import EventoSerializer, OrganizacionSerializer, TipoDeOrganizacionSerializer

class OrganizacionCreateReadView(ListCreateAPIView):
    """
    API endpoint para crear o ver todos las organizaciones
    """
    queryset = Organizacion.objects.all()
    serializer_class = OrganizacionSerializer

class OrganizacionReadUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint para leer, actualizar o eliminar una organizacion
    """
    queryset = Organizacion.objects.all()
    serializer_class = OrganizacionSerializer
    lookup_field = 'id'

class TipoDeOrganizacionCreateReadView(ListCreateAPIView):
    """
    API endpoint para crear o ver todos los tipos de organizacion
    """
    queryset = TipoDeOrganizacion.objects.all()
    serializer_class = TipoDeOrganizacionSerializer

class TipoDeOrganizacionReadUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    """
    API endpoint para leer, actualizar o eliminar un tipo de organizacion
    """
    queryset = TipoDeOrganizacion.objects.all()
    serializer_class = TipoDeOrganizacionSerializer
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