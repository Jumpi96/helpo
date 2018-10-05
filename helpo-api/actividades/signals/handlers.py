from django.dispatch import receiver
from django.db.models import F
from django.db.models.signals import post_save, pre_save, pre_delete
from actividades.models import Evento, ActividadesTasks, Participacion
from users.models import User, Suscripcion, OrganizacionProfile
from reportes.services import update_monthly_suscriptions
from actividades.services import notificar_cambio_evento
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


@receiver(post_save, sender=Evento, dispatch_uid=uuid.uuid4())
def handle_evento_change_notification(sender, instance, created, **kwags):
    """
    Notifica a todos los ususarios suscritos a una organizacion cuando
    esta crea un evento
    """
    # Busco la ong dueña del evento
    organizacion = User.objects.get(pk=instance.organizacion.id)
    # Busco todos los usuarios que tengo que notificar
    users = User.objects.filter(suscripcion__organizacion=organizacion)

    if created:
        for user in users:
            pass
            #Notificar cuando se crea el evento

@receiver(pre_save, sender=Suscripcion, dispatch_uid=uuid.uuid4())
def update_monthly_suscription_on_save(sender, instance, **kwargs):
    """
    Previo a actualizar una suscripcion llama al metodo para
    actualizar las suscripciones mensuales totales de la ONG
    """
    update_monthly_suscriptions(instance.organizacion)

@receiver(pre_delete, sender=Suscripcion, dispatch_uid=uuid.uuid4())
def update_monthly_suscription_on_delete(sender, instance, **kwargs):
    """
    Previo a borrar una suscripcion llama al metodo para
    actualizar las suscripciones mensuales total de la ONG
    """
    update_monthly_suscriptions(instance.organizacion)