from datetime import date
from users.models import OrganizacionSuscripcionesMensuales, Suscripcion


def update_monthly_suscriptions(organizacion):
    """
    Checks if a new entry in OrganizacionSuscripcionesMensuales must be created,
    and it that's the case, it creates it
    """
    today = date.today()
    query = OrganizacionSuscripcionesMensuales.objects.filter(
        organizacion=organizacion)
    if query.count() == 0:
        last_entry_suscriptions = 0
        last_entry_date = date.min
    else:
        last_entry_suscriptions = query[0].suscripciones
        last_entry_date = query[0].fecha

    if(_has_to_update(today, last_entry_date)):
        # If today month is the first of the year, the entry created will be in last year
        if(today.month == 1):
            entry = OrganizacionSuscripcionesMensuales.objects.create(
                organizacion=organizacion,
                suscripciones=count_ong_suscriptions(organizacion),
                fecha=date(today.year - 1, 12, 1)
            )
            entry.save()
        else:
            entry = OrganizacionSuscripcionesMensuales.objects.create(
                organizacion=organizacion,
                suscripciones=count_ong_suscriptions(organizacion),
                fecha=date(today.year, today.month - 1, 1)
            )
            entry.save()


def count_ong_suscriptions(organizacion):
    """
    Returns the total amount of a ong suscriptions
    """
    return Suscripcion.objects.filter(organizacion=organizacion).count()


def _has_to_update(today, last):
    """
    Compares today date with last entry year to check if an update is needed,
    that is, if at least 2 months has passed.    
    """
    # I use 70 to be sure 2 months passed.
    # Because this dates are always assigned to the first of the month it doesnt cause problems
    if(today - last).days > 70:
        return True
    return False
