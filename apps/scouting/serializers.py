from rest_framework import serializers
from .models import Nota, Segnalato, Visionato

class NotaSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    class Meta:
        model = Nota
        fields = ['id', 'anno', 'nome', 'data_caricamento', 'file', 'file_url']
    def get_file_url(self, obj):
        return obj.file.url if obj.file else None

class SegnalatoSerializer(serializers.ModelSerializer):
    note_gara_url = serializers.SerializerMethodField()
    class Meta:
        model = Segnalato
        fields = ['id','nome','cognome','squadra','anno_nascita','numero_maglia',
                  'struttura_fisica','piede','capacita_fisica','capacita_cognitiva',
                  'ruolo','descrizione_match','data_segnalazione','telefono_genitore',
                  'note_gara','note_gara_url']
    def get_note_gara_url(self, obj):
        return obj.note_gara.url if obj.note_gara else None

class VisionatoSerializer(serializers.ModelSerializer):
    note_gara_url = serializers.SerializerMethodField()
    class Meta:
        model = Visionato
        fields = ['id','nome','cognome','squadra','anno_nascita','numero_maglia',
                  'struttura_fisica','piede','capacita_fisica','capacita_cognitiva',
                  'ruolo','descrizione_match','descrizione_dettagliata',
                  'data_segnalazione','data_revisione','telefono_genitore',
                  'note_gara','note_gara_url']
    def get_note_gara_url(self, obj):
        return obj.note_gara.url if obj.note_gara else None