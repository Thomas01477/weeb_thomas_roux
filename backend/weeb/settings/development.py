import os
import dj_database_url
from .base import *

SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-dev-key-not-for-production-use-only')

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

_db_url = os.environ.get('DATABASE_URL')
if _db_url:
    DATABASES = {'default': dj_database_url.config(conn_max_age=600)}
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
]
