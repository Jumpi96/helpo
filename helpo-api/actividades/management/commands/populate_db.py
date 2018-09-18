from django.core.management.base import BaseCommand, CommandError
from decouple import config
from actividades.models import RubroEvento
from users.models import AppValues, Imagen


class Command(BaseCommand):

    help = 'Populates DB with initialization and default values'

    def handle(self, *args, **options):
        print('Populating Database...')
        print('----------------------\n')

        print('Setting Images Prerequisites')
        imgur_default_image, created = Imagen.objects.get_or_create(
            isExternal=True,
            url='https://i.imgur.com/cXItNWF.png'
        )
        print('- imgur_default_image: {0}, Created: {1}'.format(
            str(imgur_default_image.url), str(created)))
        imgur_last_refresh, created = AppValues.objects.get_or_create(
            key='imgurLastRefresh',
            value='0'
        )
        print('- imgurLastRefresh: {0}, Created: {1}'.format(
            str(imgur_last_refresh.value), str(created)))
        imgur_refresh_token, created = AppValues.objects.get_or_create(
            key='imgurRefreshToken',
            value=config('IMGUR_REFRESH_TOKEN')
        )
        print('- imgurRefreshToken: {0}, Created: {1}'.format(
            str(imgur_refresh_token.value), str(created)))
        imgur_access_token, created = AppValues.objects.get_or_create(
            key='imgurAccessToken',
            value=config('IMGUR_ACCESS_TOKEN')
        )
        print('- imgurAccessToken: {0}, Created: {1}'.format(
            str(imgur_access_token.value), str(created)))
        print('----------------------\n')

        print('Setting Rubros Evento')
        rubro_evento_1, created = RubroEvento.objects.get_or_create(
            nombre='Cultural'
        )
        print('- rubro_evento_1: {0}, Created: {1}'.format(
            str(rubro_evento_1.nombre), str(created)))
        rubro_evento_2, created = RubroEvento.objects.get_or_create(
            nombre='Deportes'
        )
        print('- rubro_evento_2: {0}, Created: {1}'.format(
            str(rubro_evento_2.nombre), str(created)))
        print('----------------------\n')
