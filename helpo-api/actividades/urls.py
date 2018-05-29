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
]