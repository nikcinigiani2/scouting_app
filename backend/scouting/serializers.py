from rest_framework import serializers
from .models import Segnalato, Visionato

class SegnalatoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Segnalato
        fields = '__all__'

class VisionatoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visionato
        fields = '__all__'
