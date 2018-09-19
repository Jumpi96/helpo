import os
import csv
from django.core.management.base import BaseCommand, CommandError
from decouple import config
from actividades.models import RubroEvento, Funcion, CategoriaRecurso, Recurso
from users.models import AppValues, Imagen, RubroOrganizacion, RubroEmpresa


class Command(BaseCommand):

    help = 'Populates DB with initialization and default values'

    def handle(self, *args, **options):

        def __set_images():
            if not AppValues.objects.filter(key='imgurRefreshToken').exists():
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
                    obj, created = CategoriaRecurso.objects.get_or_create(
                        nombre=row[0],
                        # aca se podria agregar icono
                    )
                    i += 1
                    print('- categoria_recurso_{0}: {1}, Created: {2}'.format(
                        str(i), str(obj.nombre), str(created)))

        def __set_recursos_ropa():
            path = os.path.dirname(__file__) + "/recursos_ropa.csv"
            with open(path) as f:
                reader = csv.reader(f)
                i = 0
                ropa, created = CategoriaRecurso.objects.get_or_create(
                    nombre="Ropa")
                for row in reader:
                    obj, created = Recurso.objects.get_or_create(
                        nombre=row[0],
                        categoria=ropa
                        # aca se podria agregar icono
                    )
                    i += 1
                    print('- recursos_ropa_{0}: {1}, Created: {2}'.format(
                        str(i), str(obj.nombre), str(created)))

        def __set_recursos_alimento():
            path = os.path.dirname(__file__) + "/recursos_alimento.csv"
            with open(path) as f:
                reader = csv.reader(f)
                i = 0
                alimento, created = CategoriaRecurso.objects.get_or_create(
                    nombre="Alimento")
                for row in reader:
                    obj, created = Recurso.objects.get_or_create(
                        nombre=row[0],
                        categoria=alimento
                        # aca se podria agregar icono
                    )
                    i += 1
                    print('- recursos_alimento_{0}: {1}, Created: {2}'.format(
                        str(i), str(obj.nombre), str(created)))

        def __set_recursos_calzado():
            path = os.path.dirname(__file__) + "/recursos_calzado.csv"
            with open(path) as f:
                reader = csv.reader(f)
                i = 0
                calzado, created = CategoriaRecurso.objects.get_or_create(
                    nombre="Calzado")
                for row in reader:
                    obj, created = Recurso.objects.get_or_create(
                        nombre=row[0],
                        categoria=calzado
                        # aca se podria agregar icono
                    )
                    i += 1
                    print('- recursos_calzado_{0}: {1}, Created: {2}'.format(
                        str(i), str(obj.nombre), str(created)))

        def __set_recursos_juguete():
            path = os.path.dirname(__file__) + "/recursos_juguete.csv"
            with open(path) as f:
                reader = csv.reader(f)
                i = 0
                juguetes, created = CategoriaRecurso.objects.get_or_create(
                    nombre="Juguetes")
                for row in reader:
                    obj, created = Recurso.objects.get_or_create(
                        nombre=row[0],
                        categoria=juguetes
                        # aca se podria agregar icono
                    )
                    i += 1
                    print('- recursos_juguetes_{0}: {1}, Created: {2}'.format(
                        str(i), str(obj.nombre), str(created)))

        print('Populating Database...')
        print('----------------------\n')

        print('Setting Images Prerequisites')
        __set_images()
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

        print('Setting Recursos Alimento')
        __set_recursos_alimento()
        print('----------------------\n')

        print('Setting Recursos Calzado')
        __set_recursos_calzado()
        print('----------------------\n')

        print('Setting Recursos Juguete')
        __set_recursos_juguete()
        print('----------------------\n')

        print('Setting Recursos Ropa')
        __set_recursos_ropa()
        print('----------------------\n')

        print('Setting Categorias Recurso')
        __set_categorias_recurso()
        print('----------------------\n')
