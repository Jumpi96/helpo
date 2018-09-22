from django.conf import settings
from django.conf.urls import include, url  # noqa
from django.contrib import admin
from django.views.generic import TemplateView
from rest_framework import routers
from actividades import urls as actividades_urls
from users import urls as users_urls
from rest_framework_swagger.views import get_swagger_view

schema_view = get_swagger_view(title='Helpo API')

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'auth/', include('knox.urls'))
]

urlpatterns += actividades_urls.urlpatterns
urlpatterns += users_urls.urlpatterns

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
    urlpatterns += [url(r'^docs/', schema_view)]
