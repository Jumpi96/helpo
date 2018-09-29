from datetime import date
from collections import namedtuple
from rest_framework.views import APIView
from rest_framework.response import Response
from .services import update_monthly_suscriptions
from users.models import User, Suscripcion, VoluntarioProfile, OrganizacionSuscripcionesMensuales
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
            participacion__necesidad_voluntario__evento__organizacion_id=id).filter(participacion__participo=True)
        vol_colaboraciones = User.objects.filter(
            colaboracion__necesidad_material__evento__organizacion_id=id).filter(colaboracion__entregado=True)            
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


class ONGSuscripcionesPorMesView(APIView):
    """
    View to retrieve statistics of an organization subscriptions
    by month
    """

    def get(self, request, id, format=None):
        """
        Handle GET request
        """
        organizacion = User.objects.get(pk=id)
        # Make sure that the monthly suscriptions table is up to date
        update_monthly_suscriptions(organizacion)

        monthly_subscriptions = OrganizacionSuscripcionesMensuales.objects.filter(
            organizacion=organizacion)
        data = []
        data_month = []
        aux = {
            "suscripciones": 0,
            "fecha": date(2000, 1, 1)
        }
        i = 1

        last_entry = monthly_subscriptions[0]        
        data.append(last_entry.suscripciones)
        # I cut the days in the date string
        data_month.append(str(last_entry.fecha)[0:7])

        # The loop runs until data has 10 values or there are no more entries in the QuerySet
        while i < len(monthly_subscriptions) and len(data) < 10:
            entry = monthly_subscriptions[i]

            # I use 40 to be sure there is 1 month of difference.
            # Because this dates are always assigned to the first of the month it doesnt cause problems
            if((last_entry.fecha - entry.fecha).days > 40):
                # This condition is to catch all months in between entries that doesnt have an entry.
                # In that case it gives them the same amount of subscriptions as the previous month.
                year = 0
                month = 0
                if(last_entry.fecha.month == 1):
                    year = last_entry.fecha.year - 1
                    month = 12
                else:
                    year = last_entry.fecha.year
                    month = last_entry.fecha.month - 1
                aux["fecha"] = date(year, month, 1)
                # I transform the dict to namedtuple so later i can access its values as if it were an object
                aux_entry = namedtuple("Entry", aux.keys())(*aux.values())
                entry = aux_entry
            else:
                # If there was an entry, the i pointer is moved forward
                i = i + 1
            data.append(entry.suscripciones)
            data_month.append(str(entry.fecha)[0:7])
            last_entry = entry

        response_data = {
            "data": data,
            "data_month": data_month,
        }

        return Response(response_data)


class ONGEventoStats(APIView):
    """
    View to retrieve statistics of an organization events,
    listing participaciones, colaboraciones and manos
    """

    def get(self, request, id, format=None):
        """
        Handle GET request
        """

        participaciones = []
        colaboraciones = []
        manos = []
        eventos_nombre = []

        eventos = Evento.objects.filter(organizacion=id).filter(estado=3).order_by("-fecha_hora_inicio")[:10]
        for evento in eventos:
            eventos_nombre.append(evento.nombre)

            vol_participaciones = User.objects.filter(
            participacion__necesidad_voluntario__evento=evento).filter(participacion__participo=True).count()
            participaciones.append(vol_participaciones)

            vol_colaboraciones = User.objects.filter(
            colaboracion__necesidad_material__evento=evento).filter(colaboracion__entregado=True)  .count()
            colaboraciones.append(vol_colaboraciones)

            manos_participaciones = Participacion.objects.filter(retroalimentacion_ong=True).filter(
            necesidad_voluntario__evento=evento).count()
            manos_colaboraciones = Colaboracion.objects.filter(retroalimentacion_ong=True).filter(
            necesidad_material__evento=evento).count()
            vol_manos = manos_participaciones + manos_colaboraciones
            manos.append(vol_manos)

        data = {
            "participaciones": participaciones,
            "colaboraciones": colaboraciones,
            "manos": manos,
            "eventos": eventos_nombre,
        }
            
        return Response(data)