from django.apps import AppConfig


class ActividadesConfig(AppConfig):
    name = 'actividades'

    #Here I Import my signal handlers so they will listen signals emitted by Django signal dispatcher
    def ready(self):
        import actividades.signals.handlers
