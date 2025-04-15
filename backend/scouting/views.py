from django.shortcuts import render

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Segnalato, Visionato
from .serializers import SegnalatoSerializer, VisionatoSerializer


# CRUD per Segnalati
class SegnalatoListCreateAPIView(generics.ListCreateAPIView):
    queryset = Segnalato.objects.all()
    serializer_class = SegnalatoSerializer


class SegnalatoDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Segnalato.objects.all()
    serializer_class = SegnalatoSerializer


# CRUD per Visionati
class VisionatoListCreateAPIView(generics.ListCreateAPIView):
    queryset = Visionato.objects.all()
    serializer_class = VisionatoSerializer


class VisionatoDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Visionato.objects.all()
    serializer_class = VisionatoSerializer


# Endpoint custom: conversione di Segnalato in Visionato
class ConvertiSegnalatoToVisionatoAPIView(APIView):
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
