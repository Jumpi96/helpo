from django.core.management.base import BaseCommand, CommandError
from actividades.models import ActividadesTasks, Evento
from django.utils import timezone


class Command(BaseCommand):

    help = 'Runs through ActividadesTasks and executes the ones that have already passed'

    def handle(self, *args, **options):
        
        now = timezone.now() - timezone.timedelta(hours=3)
        tasks = ActividadesTasks.objects.all().filter(execute_date__lte=now)         

        for task in tasks:
            task_type = task.tipo
            if task_type == 'EVENTO_START':
                evento = Evento.objects.get(pk=task.evento.id)
                evento.estado = 2 # in_progress
                finished_task = ActividadesTasks(evento=evento, execute_date=evento.fecha_hora_fin,              tipo='EVENTO_FINISH')
                finished_task.save()
                evento.save()
            elif task_type == 'EVENTO_FINISH':
                evento = Evento.objects.get(pk=task.evento.id)
                evento.estado = 3 # finalized
                evento.save()
                                   
            else:
                print("actividades/process_tasks: A not handled event was in ActividadesTasks")

        tasks.delete()
            