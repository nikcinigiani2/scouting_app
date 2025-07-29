from rest_framework import serializers
from .models import Segnalato, Visionato, Nota

class SegnalatoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Segnalato
        fields = '__all__'

class VisionatoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visionato
        fields = '__all__'

class NotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nota
        fields = '__all__'
