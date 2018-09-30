from django.conf.urls import url
from reportes import views as reportes_views

urlpatterns = [
    # {% url "api:rubros_evento" %}
    url(
        regex=r"^reportes/organizacion/(?P<id>[-\w]+)/$",
        view=reportes_views.OrganizationStats.as_view(),
        name="get_organizacion_stats"
    ),
    url(
        regex=r"^reportes/organizacion/genero/(?P<id>[-\w]+)/$",
        view=reportes_views.OrganizacionVoluntariosGenero.as_view(),
        name="get_organizacion_voluntarios_genero"
    ),
    url(
        regex=r"^reportes/organizacion/suscripciones/(?P<id>[-\w]+)/$",
        view=reportes_views.ONGSuscripcionesPorMesView.as_view(),
        name="get_organizacion_suscripciones_mes"
    ),
    url(
        regex=r"^reportes/organizacion/empresas/(?P<id>[-\w]+)/$",
        view=reportes_views.ONGEmpresaStats.as_view(),
        name="get_organizacion_empresas"
    ),
    url(
        regex=r"^reportes/organizacion/eventos/(?P<id>[-\w]+)/$",
        view=reportes_views.ONGEventoStats.as_view(),
        name="get_organizacion_eventos"
    ),
]