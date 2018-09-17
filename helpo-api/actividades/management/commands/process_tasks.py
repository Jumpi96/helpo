from django.core.management.base import BaseCommand, CommandError
from actividades.models import ActividadesTasks, Evento
from django.utils import timezone
from actividades.services import notificar_inicio_evento, notificar_fin_evento

class Command(BaseCommand):

    help = 'Runs through ActividadesTasks and executes the ones that have already passed'

    def handle(self, *args, **options):

        now = timezone.now()
        print(now)
        tasks = ActividadesTasks.objects.all().filter(execute_date__lte=now)

        for task in tasks:
            task_type = task.tipo
            if task_type == 'EVENTO_START':
                evento = task.evento
                evento.estado = 2  # in_progress
                finished_task = ActividadesTasks(
                    evento=evento, execute_date=evento.fecha_hora_fin, tipo='EVENTO_FINISH')
                finished_task.save()
                evento.save()
                notificar_inicio_evento(evento)

            elif task_type == 'EVENTO_FINISH':
                evento = task.evento
                evento.estado = 3  # finalized
                evento.save()
                notificar_fin_evento(evento)

            else:
                print(
                    "actividades/process_tasks: A not handled event was in ActividadesTasks")

        tasks.delete()
