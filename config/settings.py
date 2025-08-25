# config/settings.py
from pathlib import Path
import os
import dj_database_url
from corsheaders.defaults import default_headers

BASE_DIR = Path(__file__).resolve().parent.parent

# --- Flags & secrets (da env) ---
DEBUG = os.environ.get("DJANGO_DEBUG", "false").lower() == "true"
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "change-me")

# --- Helper per liste da env (tollerante a https://, virgolette, spazi) ---
def _env_list(name: str, default: str = "") -> list[str]:
    raw = os.environ.get(name, default)
    out = []
    for item in raw.split(","):
        h = (item or "").strip().replace("https://", "").replace("http://", "")
        h = h.strip("/").strip('"').strip("'")
        if h:
            out.append(h)
    return out

# --- Hosts / CSRF / CORS ---
ALLOWED_HOSTS = _env_list("ALLOWED_HOSTS", ".up.railway.app,localhost,127.0.0.1")
CSRF_TRUSTED_ORIGINS = [f"https://{h}" for h in _env_list("CSRF_TRUSTED_ORIGINS")]

CORS_ALLOWED_ORIGINS = []
for origin in _env_list("CORS_ALLOWED_ORIGINS"):
    if origin.startswith(("http://", "https://")):
        CORS_ALLOWED_ORIGINS.append(origin)
    else:
        CORS_ALLOWED_ORIGINS.append(f"https://{origin}")
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = list(default_headers) + ["authorization"]

# --- App ---
INSTALLED_APPS = [
    "apps.scouting",
    "django.contrib.admin", "django.contrib.auth", "django.contrib.contenttypes",
    "django.contrib.sessions", "django.contrib.messages", "django.contrib.staticfiles",
    "rest_framework", "django_filters", "corsheaders",
]

# --- Middleware (ordine corretto) ---
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

TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [BASE_DIR / "templates"],
    "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
    ]},
}]

WSGI_APPLICATION = "config.wsgi.application"

# --- Database (Railway) ---
DATABASES = {
    "default": dj_database_url.parse(
        os.environ.get("DATABASE_URL", "sqlite:///db.sqlite3"),
        conn_max_age=600,
        ssl_require=os.environ.get("DB_SSL_REQUIRE", "true").lower() == "true",
    )
}

# --- Password validators ---
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# --- Localizzazione ---
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# --- Static & Media ---
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "static"
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
}
MEDIA_URL = "/media/"
MEDIA_ROOT = Path(os.environ.get("MEDIA_ROOT", BASE_DIR / "media"))

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- DRF ---
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
}

# --- Proxy/HTTPS dietro Railway ---
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
USE_X_FORWARDED_PORT = True

SECURE_SSL_REDIRECT = os.environ.get("SECURE_SSL_REDIRECT", "true").lower() == "true"
SESSION_COOKIE_SECURE = os.environ.get("SESSION_COOKIE_SECURE", "true").lower() == "true"
CSRF_COOKIE_SECURE = os.environ.get("CSRF_COOKIE_SECURE", "true").lower() == "true"

# --- Login URLs ---
LOGIN_URL = "/accounts/login/"
LOGIN_REDIRECT_URL = "/dashboard/"
