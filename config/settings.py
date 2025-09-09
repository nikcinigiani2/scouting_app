# config/settings.py

from pathlib import Path
import os
import dj_database_url
from corsheaders.defaults import default_headers

BASE_DIR = Path(__file__).resolve().parent.parent

# === Flags & secrets ===
DEBUG = os.environ.get("DJANGO_DEBUG", "false").lower() == "true"
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "change-me")

# === Helpers robusti per leggere le env list (tollerano https://, virgolette, spazi) ===
def _env_list(name: str, default: str = "") -> list[str]:
    raw = os.environ.get(name, default)
    items = []
    for item in raw.split(","):
        h = (item or "").strip()
        h = h.replace("https://", "").replace("http://", "")
        h = h.strip("/").strip('"').strip("'")
        if h:
            items.append(h)
    return items

# === Hosts / CSRF / CORS ===
# di default accettiamo *.up.railway.app + locale; in produzione imposta ALLOWED_HOSTS via env
ALLOWED_HOSTS = _env_list("ALLOWED_HOSTS", ".up.railway.app,localhost,127.0.0.1")

# Inserisci in env l'origin https del tuo dominio (es.: https://scoutingapp-production.up.railway.app)
CSRF_TRUSTED_ORIGINS = [f"https://{h}" for h in _env_list("CSRF_TRUSTED_ORIGINS")]

# Inserisci in env i domini del/i frontend che chiamano le API (in https o http per dev)
CORS_ALLOWED_ORIGINS = []
for origin in _env_list("CORS_ALLOWED_ORIGINS"):
    if origin.startswith("http://") or origin.startswith("https://"):
        CORS_ALLOWED_ORIGINS.append(origin)
    else:
        CORS_ALLOWED_ORIGINS.append(f"https://{origin}")
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = list(default_headers) + ["authorization"]

# === App ===
INSTALLED_APPS = [
    "apps.scouting",

    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "django_filters",
    "corsheaders",

    "storages"
]

# === Middleware (ordine importante: WhiteNoise subito dopo Security) ===
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# === Database (Railway) ===
DATABASES = {
    "default": dj_database_url.parse(
        os.environ.get("DATABASE_URL", "sqlite:///db.sqlite3"),
        conn_max_age=600,
        ssl_require=os.environ.get("DB_SSL_REQUIRE", "true").lower() == "true",
    )
}

# === Password validators (lascia i default) ===
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# === Cloudflare R2 (S3 compatibile) ===
import os

def _has_env(*keys):
    return all(os.getenv(k) for k in keys)

USE_R2 = _has_env("R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME", "R2_ENDPOINT_URL")

if USE_R2:
    # Parametri S3 (Cloudflare R2)
    AWS_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
    AWS_STORAGE_BUCKET_NAME = os.getenv("R2_BUCKET_NAME")  # es. "note-gara"
    AWS_S3_ENDPOINT_URL = os.getenv("R2_ENDPOINT_URL")     # es. "https://<ACCOUNT_ID>.r2.cloudflarestorage.com"

    AWS_QUERYSTRING_AUTH = True            # URL firmate
    AWS_S3_FILE_OVERWRITE = False          # non sovrascrivere nomi uguali
    AWS_DEFAULT_ACL = None
    AWS_S3_ADDRESSING_STYLE = "virtual"
    AWS_S3_SIGNATURE_VERSION = "s3v4"

# === Statici & Media ===
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "static"  # Railway: collectstatic qui

# In Django 4+, usa STORAGES. Configuriamo "default" in base a USE_R2.
STORAGES = {
    "default": {
        "BACKEND": "storages.backends.s3boto3.S3Boto3Storage" if USE_R2
        else "django.core.files.storage.FileSystemStorage"
    },
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
}

# Media
if USE_R2:
    MEDIA_URL = "/media/"          # i FileField generano URL firmate R2
else:
    MEDIA_ROOT = BASE_DIR / "media" # solo in fallback locale
    MEDIA_URL = "/media/"


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# === DRF ===
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
    ],
}

# === Sicurezza/Proxy (necessario dietro Railway) ===
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
USE_X_FORWARDED_PORT = True

SECURE_SSL_REDIRECT = os.environ.get("SECURE_SSL_REDIRECT", "true").lower() == "true"
SESSION_COOKIE_SECURE = os.environ.get("SESSION_COOKIE_SECURE", "true").lower() == "true"
CSRF_COOKIE_SECURE = os.environ.get("CSRF_COOKIE_SECURE", "true").lower() == "true"

# === Login URLs ===
LOGIN_URL = "/accounts/login/"
LOGIN_REDIRECT_URL = "/dashboard/"
