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
    # {% url "api:funciones" %}
    url(
        regex=r"^actividades/funciones/$",
        view=actividades_views.FuncionCreateReadView.as_view(),
        name="get_post_funcion"
    ),
    # {% url "api:funciones" evento.id %}
    url(
        regex=r"^actividades/funciones/(?P<id>[-\w]+)/$",
        view=actividades_views.FuncionReadUpdateDeleteView.as_view(),
        name="get_put_delete_funcion"
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
    # {% url "api:eventos_voluntario" %}
    url(
        regex=r"^voluntarios/eventos/$",
        view=actividades_views.EventoVoluntarioCreateReadView.as_view(),
        name="get_post_evento_voluntario"
    ),
    # {% url "api:consulta_eventos" %}
    url(
        regex=r"^actividades/consulta_eventos/$",
        view=actividades_views.ConsultaEventosOrganizacionCreateReadView.as_view(),
        name="get_post_consulta_evento"
    ),
    # {% url "api:consulta_eventos" evento.id %}
    url(
        regex=r"^actividades/consulta_eventos/(?P<id>[-\w]+)/$",
        view=actividades_views.ConsultaEventosReadUpdateDeleteView.as_view(),
        name="get_put_delete_consulta_evento"
    ),
    # {% url "api:colaboraciones" %}
    url(
        regex=r"^actividades/colaboraciones/$",
        view=actividades_views.ColaboracionCreateReadView.as_view(),
        name="get_post_colaboracion"
    ),
    # {% url "api:colaboraciones" evento.id %}
    url(
        regex=r"^actividades/colaboraciones/(?P<id>[-\w]+)/$",
        view=actividades_views.ColaboracionReadUpdateDeleteView.as_view(),
        name="get_put_delete_colaboracion"
    ),
    # {% url "api:participaciones" %}
    url(
        regex=r"^actividades/participaciones/$",
        view=actividades_views.ParticipacionCreateReadView.as_view(),
        name="get_post_participacion"
    ),
    # {% url "api:participaciones" evento.id %}
    url(
        regex=r"^actividades/participaciones/(?P<id>[-\w]+)/$",
        view=actividades_views.ParticipacionReadUpdateDeleteView.as_view(),
        name="get_put_delete_participacion"
    ),
    # {% url "api:ofrecimiento_participaciones" %}
    url(
        regex=r"^actividades/ofrecimiento_participaciones/$",
        view=actividades_views.OfrecimientoParticipacionCreateReadView.as_view(),
        name="get_post_ofrecimiento_participacion"
    ),
    # {% url "api:consulta_necesidades" %}
    url(
        regex=r"^actividades/consulta_necesidades/(?P<id>[-\w]+)/$",
        view=actividades_views.ConsultaNecesidadesReadUpdateDeleteView.as_view(),
        name="get_post_consulta_necesidades"
    ),
    # {% url "api:comentarios" %}
    url(
        regex=r"^feedbacks/comentarios/$",
        view=actividades_views.ComentarioCreateReadView.as_view(),
        name="get_post_comentario"
    ),
    # {% url "api:comentarios" evento.id %}
    url(
        regex=r"^feedbacks/comentarios/(?P<id>[-\w]+)/$",
        view=actividades_views.ComentarioReadUpdateDeleteView.as_view(),
        name="get_put_delete_comentario"
    ),
    # {% url "api:retroalimentacion_voluntario" %}
    url(
        regex=r"^feedbacks/retroalimentacion_voluntario/$",
        view=actividades_views.RetroalimentacionVoluntarioEvento,
        name="post_retroalimentacion_voluntario"
    ),
    # {% url "api:retroalimentacion_ong" %}
    url(
        regex=r"^feedbacks/retroalimentacion_ong/$",
        view=actividades_views.RetroalimentacionONGEvento,
        name="post_retroalimentacion_ong"
    ),
    # {% url "api:evento_imagen" evento_imagen.evento %}
    url(
        regex=r"^actividades/imagenes/(?P<evento>[-\w]+)/$",
        view=actividades_views.EventoImagenListView.as_view(),
        name="get_evento_imagenes"
    ),
    # {% url "api:evento_imagen" evento_imagen.id %}
    url(
        regex=r"^actividades/imagen/(?P<id>[-\w]+)/$",
        view=actividades_views.EventoImagenRetrieveDestroyView.as_view(),
        name="get_delete_evento_imagen"
    ),
    # {% url "api:evento_imagen" evento_imagen.evento %}
    url(
        regex=r"^actividades/imagenes/$",
        view=actividades_views.EventoImagenCreateView.as_view(),
        name="post_evento_imagen"
    # {% url "api:mensajes" %}
    ),
    url(
        regex=r"^actividades/mensajes/$",
        view=actividades_views.MensajeCreateReadView.as_view(),
        name="get_post_mensaje"
    ),
    # {% url "api:comentarios" evento.id %}
    url(
        regex=r"^actividades/mensajes/(?P<id>[-\w]+)/$",
        view=actividades_views.MensajeReadUpdateDeleteView.as_view(),
        name="get_put_delete_mensaje"
    ),
]