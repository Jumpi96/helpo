from django.conf.urls import url
from reportes import views as reportes_views

urlpatterns = [
    # {% url "api:rubros_evento" %}
    url(
        regex=r"^reportes/organizacion/(?P<id>[-\w]+)/$",
        view=reportes_views.OrganizationStats.as_view(),
        name="get_organizacion_stats"
    ),
]