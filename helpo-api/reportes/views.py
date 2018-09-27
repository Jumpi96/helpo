from rest_framework.views import APIView
from rest_framework.response import Response
from users.models import User, Suscripcion, VoluntarioProfile
from actividades.models import Participacion, Colaboracion, Evento


class OrganizationStats(APIView):
    """
    View to retrieve general statistics of an organization
    """

    def total_suscripciones(self, id):
        """
        Return the total of suscripciones of the ONG(id)
        """
        return Suscripcion.objects.filter(organizacion__id=id).count()

    def total_manos(self, id):
        """
        Return the total of manos of the ONG(id)
        """        
        participaciones = Participacion.objects.filter(retroalimentacion_ong=True).filter(
            necesidad_voluntario__evento__organizacion_id=id).count()
        colaboraciones = Colaboracion.objects.filter(retroalimentacion_ong=True).filter(
            necesidad_material__evento__organizacion_id=id).count()
        manos = participaciones + colaboraciones
        return manos

    def total_eventos(self, id):
        """
        Return the total of eventos of the ONG(id)
        """
        return Evento.objects.filter(organizacion__id=id).count()        
    
    def total_voluntarios(self, id):
        """
        Return the total of unique voluntarios that participated or colaborated
        in all the ONG events
        """
        vol_participaciones = User.objects.filter(
            participacion__necesidad_voluntario__evento__organizacion_id=id)
        vol_colaboraciones = User.objects.filter(
            colaboracion__necesidad_material__evento__organizacion_id=id)
        return vol_participaciones.union(vol_colaboraciones).count()


    def get(self, request, id, format=None):
        """
        Handle GET request. 
        """
        suscripciones = self.total_suscripciones(id)
        manos = self.total_manos(id)
        eventos = self.total_eventos(id)
        voluntarios = self.total_voluntarios(id)
        data = {
            "id": id,
            "total_suscripciones": suscripciones,
            "total_manos": manos,
            "total_eventos": eventos,
            "total_voluntarios": voluntarios
        }
        return Response(data)


class OrganizacionVoluntariosGenero(APIView):
    """
    View to retrieve statistics of an organization voluntarios 
    by gender
    """

    def get(self, request, id, format=None):
        """
        Handle GET request
        """
        vol_participaciones = VoluntarioProfile.objects.filter(
            usuario__participacion__necesidad_voluntario__evento__organizacion_id=id)
        vol_colaboraciones = VoluntarioProfile.objects.filter(
            usuario__colaboracion__necesidad_material__evento__organizacion_id=id)
        voluntarios = vol_participaciones.union(vol_colaboraciones)

        hombres = 0
        mujeres = 0
        otros = 0
        nada = 0
        for voluntario in voluntarios:
            genero = voluntario.sexo
            if genero == "hombre":
                hombres = hombres + 1
            elif genero == "mujer":
                mujeres = mujeres + 1
            elif genero == "otro":
                otros = otros + 1
            else:
                nada = nada + 1 
        total = hombres + mujeres + otros + nada


        data = {
            "hombres": hombres,
            "mujeres": mujeres,
            "otros": otros,
            "nada": nada,
            "total": total 
        }
        return Response(data)
        