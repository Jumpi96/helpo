from rest_framework import viewsets
from actividades.models import Actividad, Organizacion, TipoDeOrganizacion
from actividades.serializers import ActividadSerializer, OrganizacionSerializer, TipoDeOrganizacionSerializer

class ActividadViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows actividades to be viewed or edited.
    """
    queryset = Actividad.objects.all()
    serializer_class = ActividadSerializer

class OrganizacionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows organizaciones to be viewed or edited.
    """
    queryset = Organizacion.objects.all()
    serializer_class = OrganizacionSerializer

class TipoDeOrganizacionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows tipos de organizaciones to be viewed or edited.
    """
    queryset = TipoDeOrganizacion.objects.all()
    serializer_class = TipoDeOrganizacionSerializer