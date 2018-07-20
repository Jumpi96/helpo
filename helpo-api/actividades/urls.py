from django.conf.urls import url
from actividades import views as actividades_views

urlpatterns = [ 
    # {% url "api:rubros_evento" %}
    url(
        regex=r"^actividades/rubros_evento/$",
        view=actividades_views.RubroEventoCreateReadView.as_view(),
        name="get_post_rubro_evento"
    ),
    # {% url "api:rubros_evento" rubro_evento.id %}
    url(
        regex=r"^actividades/rubros_evento/(?P<id>[-\w]+)/$",
        view=actividades_views.RubroEventoReadUpdateDeleteView.as_view(),
        name="get_put_delete_rubro_evento"
    ),
    # {% url "api:contacto" %}
    url(
        regex=r"^actividades/contacto/$",
        view=actividades_views.ContactoEventoCreateReadView.as_view(),
        name="get_post_contacto_evento"
    ),
    # {% url "api:contacto" contacto.id %}
    url(
        regex=r"^actividades/contacto/(?P<id>[-\w]+)/$",
        view=actividades_views.ContactoEventoReadUpdateDeleteView.as_view(),
        name="get_put_delete_contacto_evento"
    ),
    
    # {% url "api:eventos" %}
    url(
        regex=r"^actividades/eventos/$",
        view=actividades_views.EventoCreateReadView.as_view(),
        name="get_post_evento"
    ),
    # {% url "api:eventos" evento.id %}
    url(
        regex=r"^actividades/eventos/(?P<id>[-\w]+)/$",
        view=actividades_views.EventoReadUpdateDeleteView.as_view(),
        name="get_put_delete_evento"
    ),
    # {% url "api:categorias_recurso" %}
    url(
        regex=r"^actividades/categorias_recurso/$",
        view=actividades_views.CategoriaRecursoCreateReadView.as_view(),
        name="get_post_categoria_recurso"
    ),
    # {% url "api:categorias_recurso" evento.id %}
    url(
        regex=r"^actividades/categorias_recurso/(?P<id>[-\w]+)/$",
        view=actividades_views.CategoriaRecursoReadUpdateDeleteView.as_view(),
        name="get_put_delete_categoria_recurso"
    ),
    # {% url "api:recursos" %}
    url(
        regex=r"^actividades/recursos/$",
        view=actividades_views.RecursoCreateReadView.as_view(),
        name="get_post_recurso"
    ),
    # {% url "api:recursos" evento.id %}
    url(
        regex=r"^actividades/recursos/(?P<id>[-\w]+)/$",
        view=actividades_views.RecursoReadUpdateDeleteView.as_view(),
        name="get_put_delete_recurso"
    ),
    # {% url "api:necesidades" %}
    url(
        regex=r"^actividades/necesidades/$",
        view=actividades_views.NecesidadCreateReadView.as_view(),
        name="get_post_necesidad"
    ),
    # {% url "api:necesidades" evento.id %}
    url(
        regex=r"^actividades/necesidades/(?P<id>[-\w]+)/$",
        view=actividades_views.NecesidadReadUpdateDeleteView.as_view(),
        name="get_put_delete_necesidad"
    ),
    # {% url "api:voluntarios" %}
    url(
        regex=r"^actividades/voluntarios/$",
        view=actividades_views.VoluntarioCreateReadView.as_view(),
        name="get_post_voluntario"
    ),
    # {% url "api:voluntarios" evento.id %}
    url(
        regex=r"^actividades/voluntarios/(?P<id>[-\w]+)/$",
        view=actividades_views.VoluntarioReadUpdateDeleteView.as_view(),
        name="get_put_delete_voluntario"
    ),
    # {% url "api:eventos_organizacion" %}
    url(
        regex=r"^organizaciones/eventos/$",
        view=actividades_views.EventoOrganizacionCreateReadView.as_view(),
        name="get_post_evento_organizacion"
    ),
    # {% url "api:consulta_eventos" %}
    url(
        regex=r"^actividades/consulta_eventos/$",
        view=actividades_views.ConsultaEventosOrganizacionCreateReadView.as_view(),
        name="get_post_consulta_evento"
    ),
]