from django.conf.urls import url
from actividades import views as actividades_views

urlpatterns = [ 
    # {% url "api:tipos_de_organizaciones" %}
    url(
        regex=r"^tipos_de_organizaciones/$",
        view=actividades_views.TipoDeOrganizacionCreateReadView.as_view(),
        name="get_post_tipo_de_organizacion"
    ),
    # {% url "api:tipos_de_organizaciones" tipo_de_organizacion.id %}
    url(
        regex=r"^tipos_de_organizaciones/(?P<id>[-\w]+)/$",
        view=actividades_views.TipoDeOrganizacionReadUpdateDeleteView.as_view(),
        name="get_put_delete_tipo_de_organizacion"
    ),
    # {% url "api:organizaciones" %}
    url(
        regex=r"^organizaciones/$",
        view=actividades_views.OrganizacionCreateReadView.as_view(),
        name="get_post_organizacion"
    ),
    # {% url "api:organizaciones" organizacion.id %}
    url(
        regex=r"^organizaciones/(?P<id>[-\w]+)/$",
        view=actividades_views.OrganizacionReadUpdateDeleteView.as_view(),
        name="get_put_delete_organizacion"
    ),
    # {% url "api:actividades" %}
    url(
        regex=r"^actividades/$",
        view=actividades_views.ActividadCreateReadView.as_view(),
        name="get_post_actividad"
    ),
    # {% url "api:actividades" organizacion.id %}
    url(
        regex=r"^actividades/(?P<id>[-\w]+)/$",
        view=actividades_views.ActividadReadUpdateDeleteView.as_view(),
        name="get_put_delete_actividad"
    ),
]