#!/usr/bin/env bash
set -e
python manage.py migrate --noinput
python manage.py collectstatic --noinput
exec gunicorn scouting_project.wsgi:application --bind 0.0.0.0:${PORT:-8000}
