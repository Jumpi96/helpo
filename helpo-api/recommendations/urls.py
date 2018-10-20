from django.conf.urls import url
from recommendations import views as recommendations_views

urlpatterns = [ 
    # {% url "api:train" %}
    url(
        regex=r"^recommendations/train/$",
        view=recommendations_views.Train,
        name="train_recommendations"
    ),
]