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
]