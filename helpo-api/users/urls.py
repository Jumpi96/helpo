from django.conf.urls import url
from users import views as users_views

urlpatterns = [ 
    # {% url "api:sign_up" %}
    url(
        regex=r"^auth/sign_up/$",
        view=users_views.CreateUserView.as_view(),
        name="sign_up_user"
    ),
    # {% url "api:log_in" %}
    url(
        regex=r"^auth/log_in/$",
        view=users_views.LoginView.as_view(),
        name="log_in_user"
    ),
    # {% url "api:log_in" %}
    url(
        regex=r"^auth/user/$",
        view=users_views.UserView.as_view(),
        name="user"
    ),
    # {% url "api:rubros_organizacion" %}
    url(
        regex=r"^perfiles/rubros_organizacion/$",
        view=users_views.RubroOrganizacionCreateReadView.as_view(),
        name="get_post_rubro_organizacion"
    ),
    # {% url "api:rubros_organizacion" rubro_organizacion.id %}
    url(
        regex=r"^perfiles/rubros_organizacion/(?P<id>[-\w]+)/$",
        view=users_views.RubroOrganizacionReadUpdateDeleteView.as_view(),
        name="get_put_delete_rubro_organizacion"
    ),
    # {% url "api:perfil_organizacion" usuario.id %}
    url(
        regex=r"^perfiles/perfil_organizacion/(?P<usuario>[-\w]+)/$",
        view=users_views.OrgProfileReadUpdateDeleteView.as_view(),
        name="get_put_delete_perfil_organizacion"
    ),
]