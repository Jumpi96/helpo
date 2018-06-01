from django.conf.urls import url
from users import views as users_views

urlpatterns = [ 
    # {% url "api:sign_up" %}
    url(
        regex=r"^auth/sign_up/$",
        view=users_views.CreateUserView.as_view(),
        name="sign_up_user"
    ),
]