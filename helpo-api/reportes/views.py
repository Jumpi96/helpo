from rest_framework.views import APIView
from rest_framework.response import Response
from users.models import User, Suscripcion

class OrganizationStats(APIView):
    """
    View to retrieve general statistics of an organization
    """

    def get(self, request, id, format=None):
        suscripciones = Suscripcion.objects.filter(organizacion__id=id).count()
        data = {
            "total_suscripciones": suscripciones
        }
        return Response(data)
