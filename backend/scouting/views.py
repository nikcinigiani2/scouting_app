from django.shortcuts import render
from django.contrib.auth import authenticate
from django.utils import timezone
from django.db import models
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
            "nome": segnalato.nome,
            "cognome": segnalato.cognome,
            "struttura_fisica": segnalato.struttura_fisica,
            "piede": segnalato.piede,
            "capacita_fisica": segnalato.capacita_fisica,
            "capacita_cognitiva": segnalato.capacita_cognitiva,
            "descrizione_match": segnalato.descrizione_match,
            "ruolo": segnalato.ruolo,
            "collaboratore": segnalato.collaboratore.id,
            "data_segnalazione": segnalato.data_segnalazione,
            "telefono_genitore": request.data.get("telefono_genitore", ""),
            # I campi extra per il Visionato possono essere forniti nel body della richiesta
            "descrizione_dettagliata": request.data.get("descrizione_dettagliata", ""),
            "data_revisione": timezone.now().date()
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

# Vista per la ricerca globale (segnalati + visionati)
class GlobalSearchAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Parametri di ricerca
        search = request.query_params.get('search', '')
        squadra = request.query_params.get('squadra', '')
        anno = request.query_params.get('anno', '')
        ruolo = request.query_params.get('ruolo', '')
        piede = request.query_params.get('piede', '')
        tipo = request.query_params.get('tipo', 'tutti')  # 'segnalati', 'visionati', 'tutti'
        
        # Query per segnalati
        segnalati_query = Segnalato.objects.all()
        if search:
            segnalati_query = segnalati_query.filter(
                models.Q(nome__icontains=search) |
                models.Q(cognome__icontains=search) |
                models.Q(squadra__icontains=search) |
                models.Q(struttura_fisica__icontains=search) |
                models.Q(descrizione_match__icontains=search)
            )
        if squadra:
            segnalati_query = segnalati_query.filter(squadra__icontains=squadra)
        if anno:
            segnalati_query = segnalati_query.filter(anno_nascita=anno)
        if ruolo:
            segnalati_query = segnalati_query.filter(ruolo=ruolo)
        if piede:
            segnalati_query = segnalati_query.filter(piede=piede)
        
        # Query per visionati
        visionati_query = Visionato.objects.all()
        if search:
            visionati_query = visionati_query.filter(
                models.Q(nome__icontains=search) |
                models.Q(cognome__icontains=search) |
                models.Q(squadra__icontains=search) |
                models.Q(struttura_fisica__icontains=search) |
                models.Q(descrizione_match__icontains=search)
            )
        if squadra:
            visionati_query = visionati_query.filter(squadra__icontains=squadra)
        if anno:
            visionati_query = visionati_query.filter(anno_nascita=anno)
        if ruolo:
            visionati_query = visionati_query.filter(ruolo=ruolo)
        if piede:
            visionati_query = visionati_query.filter(piede=piede)
        
        # Serializza i risultati
        segnalati_data = SegnalatoSerializer(segnalati_query, many=True).data
        visionati_data = VisionatoSerializer(visionati_query, many=True).data
        
        # Aggiungi il tipo a ogni risultato
        for item in segnalati_data:
            item['tipo'] = 'segnalato'
        for item in visionati_data:
            item['tipo'] = 'visionato'
        
        # Combina i risultati in base al tipo richiesto
        if tipo == 'segnalati':
            results = segnalati_data
        elif tipo == 'visionati':
            results = visionati_data
        else:  # 'tutti'
            results = segnalati_data + visionati_data
        
        return Response({
            'segnalati': segnalati_data,
            'visionati': visionati_data,
            'tutti': results,
            'count_segnalati': len(segnalati_data),
            'count_visionati': len(visionati_data),
            'count_totale': len(results)
        })
