#!/usr/bin/env python3
"""
Script per eliminare tutti i giocatori dal database
"""
import os
import django

# Configura Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scouting_app.settings')
django.setup()

from scouting.models import Segnalato, Visionato

def clear_all_players():
    """Elimina tutti i giocatori segnalati e visionati"""
    try:
        # Conta i record prima dell'eliminazione
        segnalati_count = Segnalato.objects.count()
        visionati_count = Visionato.objects.count()
        
        print(f"Prima dell'eliminazione:")
        print(f"- Giocatori segnalati: {segnalati_count}")
        print(f"- Giocatori visionati: {visionati_count}")
        
        # Elimina tutti i record
        Segnalato.objects.all().delete()
        Visionato.objects.all().delete()
        
        # Verifica l'eliminazione
        segnalati_after = Segnalato.objects.count()
        visionati_after = Visionato.objects.count()
        
        print(f"\nDopo l'eliminazione:")
        print(f"- Giocatori segnalati: {segnalati_after}")
        print(f"- Giocatori visionati: {visionati_after}")
        
        print(f"\n✅ Eliminati con successo {segnalati_count} giocatori segnalati e {visionati_count} giocatori visionati!")
        
    except Exception as e:
        print(f"❌ Errore durante l'eliminazione: {e}")

if __name__ == "__main__":
    print("🗑️  Eliminazione di tutti i giocatori dal database...")
    clear_all_players() 