from decouple import Csv, config
from .base import *  # noqa

DEBUG = False

SECRET_KEY = config('SECRET_KEY')

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "db-helpo",
        "USER": "postgres",
        "PASSWORD": "postgres",
        "HOST": "db",
        "PORT": "5432",
    }
}

ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=Csv())

STATIC_ROOT = base_dir_join('staticfiles')
STATIC_URL = '/static/'

MEDIA_ROOT = base_dir_join('mediafiles')
MEDIA_URL = '/media/'

DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

AUTH_PASSWORD_VALIDATORS = []  # allow easy passwords only on local

# Celery
CELERY_TASK_ALWAYS_EAGER = True

# CORS
CORS_ORIGIN_WHITELIST = (
    u'helpo.com.ar',
    u'www.helpo.com.ar',
    u'http://helpo.com.ar',
    u'https://helpo.com.ar',
    u'http://www.helpo.com.ar',
    u'https://www.helpo.com.ar',
    u'helpo.com.ar:80',
    u'www.helpo.com.ar:80',
    u'http://helpo.com.ar:80',
    u'http://www.helpo.com.ar:80',
    u'helpo.com.ar:443',
    u'www.helpo.com.ar:443',
    u'https://helpo.com.ar:443',
    u'https://www.helpo.com.ar:443',
    u'helpo.com.ar:8080',
    u'www.helpo.com.ar:8080',
    u'http://helpo.com.ar:8080',
    u'http://www.helpo.com.ar:8080',
    u'helpo.com.ar:8443',
    u'www.helpo.com.ar:8443',
    u'https://helpo.com.ar:8443',
    u'https://www.helpo.com.ar:8443'
)

# Security
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 3600
SECURE_HSTS_INCLUDE_SUBDOMAINS = True

SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
CSRF_COOKIE_HTTPONLY = True

# django-debug-toolbar and django-debug-toolbar-request-history
INSTALLED_APPS += ('debug_toolbar',)
MIDDLEWARE += ('debug_toolbar.middleware.DebugToolbarMiddleware',)
INTERNAL_IPS = ['127.0.0.1', '::1']

DEBUG_TOOLBAR_PANELS = [
    'ddt_request_history.panels.request_history.RequestHistoryPanel',
    'debug_toolbar.panels.versions.VersionsPanel',
    'debug_toolbar.panels.timer.TimerPanel',
    'debug_toolbar.panels.settings.SettingsPanel',
    'debug_toolbar.panels.headers.HeadersPanel',
    'debug_toolbar.panels.request.RequestPanel',
    'debug_toolbar.panels.sql.SQLPanel',
    'debug_toolbar.panels.staticfiles.StaticFilesPanel',
    'debug_toolbar.panels.templates.TemplatesPanel',
    'debug_toolbar.panels.cache.CachePanel',
    'debug_toolbar.panels.signals.SignalsPanel',
    'debug_toolbar.panels.logging.LoggingPanel',
    'debug_toolbar.panels.redirects.RedirectsPanel',
]

# Fix My Django
INSTALLED_APPS += ('fixmydjango',)
FIX_MY_DJANGO_ADMIN_MODE = True

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': '%(levelname)-8s [%(asctime)s] %(name)s: %(message)s'
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'standard',
        },
    },
    'loggers': {
        '': {
            'handlers': ['console'],
            'level': 'INFO'
        },
        'celery': {
            'handlers': ['console'],
            'level': 'INFO'
        }
    }
}

JS_REVERSE_JS_MINIFY = False
