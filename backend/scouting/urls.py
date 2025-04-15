# scouting/urls.py
from django.urls import path
from .views import (
    SegnalatoListCreateAPIView,
    SegnalatoDetailAPIView,
    VisionatoListCreateAPIView,
    VisionatoDetailAPIView,
    ConvertiSegnalatoToVisionatoAPIView
)

urlpatterns = [
    # API per i Segnalati
    path('segnalati/', SegnalatoListCreateAPIView.as_view(), name='segnalato-list-create'),
    path('segnalati/<int:pk>/', SegnalatoDetailAPIView.as_view(), name='segnalato-detail'),
    # API per i Visionati
    path('visionati/', VisionatoListCreateAPIView.as_view(), name='visionato-list-create'),
    path('visionati/<int:pk>/', VisionatoDetailAPIView.as_view(), name='visionato-detail'),
    # Endpoint per la conversione
    path('converti/<int:pk>/', ConvertiSegnalatoToVisionatoAPIView.as_view(), name='converti-segnalato'),
]
