from django.conf import settings
from django.conf.urls import include, url  # noqa
from django.contrib import admin
from django.views.generic import TemplateView
from rest_framework import routers
from actividades import views
import django_js_reverse.views

router = routers.DefaultRouter()
router.register(r'actividades', views.ActividadViewSet)
router.register(r'organizaciones', views.OrganizacionViewSet)
router.register(r'tipos_de_organizaciones', views.TipoDeOrganizacionViewSet)

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^', include(router.urls)),
    url(r'^jsreverse/$', django_js_reverse.views.urls_js, name='js_reverse'),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
