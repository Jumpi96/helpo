import os
import sys
from .base import *  # noqa
from decouple import Csv, config


DEBUG = True

HOST = 'http://ec2-44-224-248-9.us-west-2.compute.amazonaws.com:8080'

ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=Csv())

SECRET_KEY = 'secret'

CORS_ORIGIN_WHITELIST = (
    u'ec2-44-224-248-9.us-west-2.compute.amazonaws.com',
    u'www.ec2-44-224-248-9.us-west-2.compute.amazonaws.com',
    u'http://ec2-44-224-248-9.us-west-2.compute.amazonaws.com',
    u'http://www.ec2-44-224-248-9.us-west-2.compute.amazonaws.com',
    u'ec2-44-224-248-9.us-west-2.compute.amazonaws.com:80',
    u'www.ec2-44-224-248-9.us-west-2.compute.amazonaws.com:80',
    u'http://ec2-44-224-248-9.us-west-2.compute.amazonaws.com:80',
    u'http://www.ec2-44-224-248-9.us-west-2.compute.amazonaws.com:80',
    u'ec2-44-224-248-9.us-west-2.compute.amazonaws.com:8080',
    u'www.ec2-44-224-248-9.us-west-2.compute.amazonaws.com:8080',
    u'http://ec2-44-224-248-9.us-west-2.compute.amazonaws.com:8080',
    u'http://www.ec2-44-224-248-9.us-west-2.compute.amazonaws.com:8080'
)

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

STATIC_ROOT = base_dir_join('staticfiles')
STATIC_URL = '/static/'

MEDIA_ROOT = base_dir_join('mediafiles')
MEDIA_URL = '/media/'

DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

AUTH_PASSWORD_VALIDATORS = []  # allow easy passwords only on local

# Celery
CELERY_TASK_ALWAYS_EAGER = True

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

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': '[%(asctime)s] %(message)s'
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'standard',
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': str(os.path.abspath(os.path.dirname(sys.argv[0]))) + '/logs/debug.log',
            'formatter': 'standard',
        },
        'file_warning': {
            'level': 'WARNING',
            'class': 'logging.FileHandler',
            'filename': str(os.path.abspath(os.path.dirname(sys.argv[0]))) + '/logs/warning.log',
            'formatter': 'standard',
        },
        'null': {
            'level': 'DEBUG',
            'class': 'logging.NullHandler',
        },
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['null'],  # Quiet by default!
            'propagate': False,
            'level': 'DEBUG',
        },
        'django': {
            'handlers': ['console', 'file', 'file_warning'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}

JS_REVERSE_JS_MINIFY = False

# Email
NOTIFICATION_EMAIL = 'staging@helpo.com.ar'
REGISTER_EMAIL = 'staging@helpo.com.ar'