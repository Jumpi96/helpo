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
    url(
        regex=r"^verify_email/$",
        view=users_views.VerifyMailView.as_view(),
        name="user"
    ),    
]