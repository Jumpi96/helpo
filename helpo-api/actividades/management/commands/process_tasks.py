from django.core.management.base import BaseCommand, CommandError
from actividades.models import ActividadesTasks, Evento
from django.utils import timezone
from actividades.services import notificar_inicio_evento, notificar_fin_evento
import logging
import os
import sys
import threading
import time


class Command(BaseCommand):

    help = 'Runs through ActividadesTasks and executes the ones that have already passed'

    def handle(self, *args, **options):
        logger = logging.getLogger(__name__)
        filename = str(os.path.abspath(os.path.dirname(
            sys.argv[0]))) + '/logs/process_tasks.log'
        hdlr = logging.FileHandler(filename)
        formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
        hdlr.setFormatter(formatter)
        logger.addHandler(hdlr)
        logger.setLevel(logging.DEBUG)

        def handle_worker():
            while True:
                now = timezone.now()
                tasks = ActividadesTasks.objects.all().filter(execute_date__lte=now)
                if len(tasks) == 0:
                    logger.debug(
                        'No existen actividades a ejecutar, durmiendo por 60 segundos')
                    time.sleep(60)
                    continue
                logger.info('Existen %s actividades a ejecutar' % len(tasks))
                for task in tasks:
                    logger.info('Ejecutando actividad: %s' % str(task))
                    task_type = task.tipo
                    if task_type == 'EVENTO_START':
                        evento = task.evento
                        evento.estado = 2  # in_progress
                        finished_task = ActividadesTasks(
                            evento=evento, execute_date=evento.fecha_hora_fin, tipo='EVENTO_FINISH')
                        finished_task.save()
                        evento.save()
                        logger.debug(notificar_inicio_evento(
                            evento, cron_exec=True))
                        logger.info(
                            'Actividad de tipo EVENTO_START ejecutada')
                    elif task_type == 'EVENTO_FINISH':
                        evento = task.evento
                        evento.estado = 3  # finalized
                        evento.save()
                        logger.debug(notificar_fin_evento(
                            evento, cron_exec=True))
                        logger.info(
                            'Actividad de tipo EVENTO_FINISH ejecutada')
                    else:
                        logger.error(
                            "actividades/process_tasks: A not handled event was in ActividadesTasks")
                logger.info(
                    'Borradas %s actividades, durmiendo por 60 segundos' % len(tasks))
                tasks.delete()
                time.sleep(60)

        t = threading.Thread(target=handle_worker)
        t.daemon = True
        t.start()
