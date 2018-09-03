from django.dispatch import receiver
from django.db.models.signals import post_save
from actividades.models import Evento, ActividadesTasks
import uuid

""" Module where all signal handlers for the Actividades app are defined """

@receiver(post_save, sender=Evento, dispatch_uid=uuid.uuid4())
def handle_evento_scheduling(sender, instance , created, **kwargs):
  
    """ Creates or updates an ActividadesTask whenever a Evento is saved """

    if created:
        task = ActividadesTasks(tipo='EVENTO_START', execute_date=instance.fecha_hora_inicio, evento=instance)
        task.save()
    elif instance.estado == 1: # created
        task = ActividadesTasks.objects.all().filter(tipo='EVENTO_START', evento=instance)[0]
        task.execute_date = instance.fecha_hora_inicio
        task.save()
    else:
        pass
