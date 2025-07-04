from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from .models import Segnalato, Visionato
from .serializers import SegnalatoSerializer, VisionatoSerializer

# CRUD per Segnalati
class SegnalatoListCreateAPIView(generics.ListCreateAPIView):
    queryset = Segnalato.objects.all()
    serializer_class = SegnalatoSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(collaboratore=self.request.user)


class SegnalatoDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Segnalato.objects.all()
    serializer_class = SegnalatoSerializer
    permission_classes = [IsAuthenticated]


# CRUD per Visionati
class VisionatoListCreateAPIView(generics.ListCreateAPIView):
    queryset = Visionato.objects.all()
    serializer_class = VisionatoSerializer
    permission_classes = [IsAuthenticated]


class VisionatoDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Visionato.objects.all()
    serializer_class = VisionatoSerializer
    permission_classes = [IsAuthenticated]


# Endpoint custom: conversione di Segnalato in Visionato
class ConvertiSegnalatoToVisionatoAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, pk):
        try:
            segnalato = Segnalato.objects.get(pk=pk)
        except Segnalato.DoesNotExist:
            return Response({'error': 'Segnalato non trovato'}, status=status.HTTP_404_NOT_FOUND)

        # Prepara i dati per il modello Visionato partendo da quelli del segnalato
        visionato_data = {
            "anno_nascita": segnalato.anno_nascita,
            "numero_maglia": segnalato.numero_maglia,
            "squadra": segnalato.squadra,
            "descrizione_match": segnalato.descrizione_match,
            "ruolo": segnalato.ruolo,
            "collaboratore": segnalato.collaboratore.id,
            # I campi extra per il Visionato possono essere forniti nel body della richiesta
            "descrizione_dettagliata": request.data.get("descrizione_dettagliata", ""),
            "telefono_genitore": request.data.get("telefono_genitore", "")
        }
        serializer = VisionatoSerializer(data=visionato_data)
        if serializer.is_valid():
            serializer.save()
            # Opzionale: elimina il record Segnalato una volta convertito
            segnalato.delete()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Endpoint di ricerca/filtri avanzati per Segnalati
class SegnalatoSearchAPIView(generics.ListAPIView):
    queryset = Segnalato.objects.all()
    serializer_class = SegnalatoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = [
        'anno_nascita', 'squadra', 'piede', 'nome', 'cognome', 'ruolo', 'stato', 'numero_maglia', 'struttura_fisica'
    ]
    search_fields = ['nome', 'cognome', 'squadra', 'struttura_fisica', 'descrizione_match']
    permission_classes = [IsAuthenticated]


# Endpoint di ricerca/filtri avanzati per Visionati
class VisionatoSearchAPIView(generics.ListAPIView):
    queryset = Visionato.objects.all()
    serializer_class = VisionatoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = [
        'anno_nascita', 'squadra', 'piede', 'nome', 'cognome', 'ruolo', 'numero_maglia', 'struttura_fisica'
    ]
    search_fields = ['nome', 'cognome', 'squadra', 'struttura_fisica', 'descrizione_match']
    permission_classes = [IsAuthenticated]

# Vista per il login
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({
                'error': 'Username e password sono richiesti'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                }
            })
        else:
            return Response({
                'error': 'Credenziali non valide'
            }, status=status.HTTP_401_UNAUTHORIZED)

# Vista per ottenere informazioni dell'utente corrente
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
        })
