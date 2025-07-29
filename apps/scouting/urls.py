# scouting/urls.py
from django.urls import path
from .views import (
    SegnalatoListCreateAPIView,
    SegnalatoDetailAPIView,
    VisionatoListCreateAPIView,
    VisionatoDetailAPIView,
    ConvertiSegnalatoToVisionatoAPIView,
    SegnalatoSearchAPIView,
    VisionatoSearchAPIView,
    LoginView,
    UserProfileView,
    GlobalSearchAPIView,
    NotaViewSet
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'note', NotaViewSet, basename='nota')

urlpatterns = [
    # API di autenticazione
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
    
    # API per i Segnalati
    path('segnalati/', SegnalatoListCreateAPIView.as_view(), name='segnalato-list-create'),
    path('segnalati/<int:pk>/', SegnalatoDetailAPIView.as_view(), name='segnalato-detail'),
    path('segnalati/ricerca/', SegnalatoSearchAPIView.as_view(), name='segnalato-search'),
    # API per i Visionati
    path('visionati/', VisionatoListCreateAPIView.as_view(), name='visionato-list-create'),
    path('visionati/<int:pk>/', VisionatoDetailAPIView.as_view(), name='visionato-detail'),
    path('visionati/ricerca/', VisionatoSearchAPIView.as_view(), name='visionato-search'),
    # Endpoint per la conversione
    path('converti/<int:pk>/', ConvertiSegnalatoToVisionatoAPIView.as_view(), name='converti-segnalato'),
    # Endpoint per la ricerca globale
    path('ricerca/', GlobalSearchAPIView.as_view(), name='global-search'),
]

urlpatterns += router.urls
