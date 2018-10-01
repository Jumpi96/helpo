import os
import csv
from django.core.management.base import BaseCommand, CommandError
from decouple import config
from actividades.models import RubroEvento, Funcion, CategoriaRecurso, Recurso
from users.models import AppValues, Imagen, RubroOrganizacion, RubroEmpresa, User, UserManager


class Command(BaseCommand):

    help = 'Populates DB with initialization and default values'

    def handle(self, *args, **options):

        def __set_super_user():
            if not User.objects.filter(email='helpoweb@gmail.com').exists():
                created = User.objects.create_superuser(
                    email="helpoweb@gmail.com",
                    nombre="Helpo",
                    password=config('SECRET_KEY'),
                    user_type=1
                )
                print('- superuser: helpoweb@gmail.com, Created: {0}'.format(
                    str(created)))

        def __set_images():
            if not AppValues.objects.filter(key='imgurRefreshToken').exists():
                imgur_refresh_token, created = AppValues.objects.get_or_create(
                    key='imgurRefreshToken',
                    value=config('IMGUR_REFRESH_TOKEN')
                )
                print('- imgurRefreshToken: FROM ENV, Created: {0}'.format(
                    str(created)))
                imgur_access_token, created = AppValues.objects.get_or_create(
                    key='imgurAccessToken',
                    value=config('IMGUR_ACCESS_TOKEN')
                )
                print('- imgurAccessToken: FROM ENV, Created: {0}'.format(
                    str(created)))
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

        def __set_rubros_evento():
            path = os.path.dirname(__file__) + "/rubros_evento.csv"
            with open(path) as f:
                reader = csv.reader(f)
                i = 0
                for row in reader:
                    obj, created = RubroEvento.objects.get_or_create(
                        nombre=row[0],
                    )
                    i += 1
                    print('- rubro_evento_{0}: {1}, Created: {2}'.format(
                        str(i), str(obj.nombre), str(created)))

        def __set_rubros_ong():
            path = os.path.dirname(__file__) + "/rubros_ong.csv"
            with open(path) as f:
                reader = csv.reader(f)
                i = 0
                for row in reader:
                    obj, created = RubroOrganizacion.objects.get_or_create(
                        nombre=row[0],
                    )
                    i += 1
                    print('- rubro_ong_{0}: {1}, Created: {2}'.format(
                        str(i), str(obj.nombre), str(created)))

        def __set_rubros_empresa():
            path = os.path.dirname(__file__) + "/rubros_empresa.csv"
            with open(path) as f:
                reader = csv.reader(f)
                i = 0
                for row in reader:
                    obj, created = RubroEmpresa.objects.get_or_create(
                        nombre=row[0],
                    )
                    i += 1
                    print('- rubro_empresa_{0}: {1}, Created: {2}'.format(
                        str(i), str(obj.nombre), str(created)))

        def __set_funciones_voluntario():
            path = os.path.dirname(__file__) + "/funciones_voluntario.csv"
            with open(path) as f:
                reader = csv.reader(f)
                i = 0
                for row in reader:
                    obj, created = Funcion.objects.get_or_create(
                        nombre=row[0],
                    )
                    i += 1
                    print('- funcion_voluntario_{0}: {1}, Created: {2}'.format(
                        str(i), str(obj.nombre), str(created)))

        def __set_categorias_recurso():
            path = os.path.dirname(__file__) + "/categorias_recurso.csv"
            with open(path) as f:
                reader = csv.reader(f)
                i = 0
                for row in reader:
                    categoria, created = CategoriaRecurso.objects.get_or_create(
                        nombre=row[0],
                        # aca se podria agregar icono
                    )
                    i += 1
                    print('- categoria_recurso_{0}: {1}, Created: {2}'.format(
                        str(i), str(categoria.nombre), str(created)))
                    for j in range(1, len(row)-1):
                        recurso, created = Recurso.objects.get_or_create(
                            nombre=row[j],
                            categoria=categoria
                            # aca se podria agregar icono
                        )
                        print('- recursos_{0}_{1}: {2}, Created: {3}'.format(
                            str(categoria.nombre), str(j), str(recurso.nombre), str(created)))

        print('Populating Database...')
        print('----------------------\n')

        print('Setting Images Prerequisites')
        __set_images()
        print('----------------------\n')

        print('Setting Superuser')
        __set_super_user()
        print('----------------------\n')

        print('Setting Rubros Evento')
        __set_rubros_evento()
        print('----------------------\n')

        print('Setting Rubros ONG')
        __set_rubros_ong()
        print('----------------------\n')

        print('Setting Rubros Empresa')
        __set_rubros_empresa()
        print('----------------------\n')

        print('Setting Funciones Voluntario')
        __set_funciones_voluntario()
        print('----------------------\n')

        print('Setting Categorias Recurso')
        __set_categorias_recurso()
        print('----------------------\n')
