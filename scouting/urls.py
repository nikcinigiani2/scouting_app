from django.urls import path
from .views import (
    SegnalatoListCreateAPIView,
    SegnalatoDetailAPIView,
    VisionatoListCreateAPIView,
    VisionatoDetailAPIView,
    ConvertiSegnalatoToVisionatoAPIView,
    SegnalatoSearchAPIView,
    VisionatoSearchAPIView,
    get_csrf_token,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('segnalati/', SegnalatoListCreateAPIView.as_view(), name='segnalato-list-create'),
    path('segnalati/<int:pk>/', SegnalatoDetailAPIView.as_view(), name='segnalato-detail'),
    path('segnalati/ricerca/', SegnalatoSearchAPIView.as_view(), name='segnalato-search'),
    path('visionati/', VisionatoListCreateAPIView.as_view(), name='visionato-list-create'),
    path('visionati/<int:pk>/', VisionatoDetailAPIView.as_view(), name='visionato-detail'),
    path('visionati/ricerca/', VisionatoSearchAPIView.as_view(), name='visionato-search'),
    path('converti/<int:pk>/', ConvertiSegnalatoToVisionatoAPIView.as_view(), name='converti-segnalato'),
    path('csrf/', get_csrf_token, name='get-csrf-token'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] 