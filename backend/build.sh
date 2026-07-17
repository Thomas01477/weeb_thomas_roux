#!/usr/bin/env bash
set -e
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --no-input

if [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  python manage.py createsuperuser --noinput || true
fi
