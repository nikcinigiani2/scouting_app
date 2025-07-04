from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator
from django.utils import timezone

User = get_user_model()

# Modello base astratto per i giocatori
class GiocatoreBase(models.Model):
    anno_nascita = models.PositiveIntegerField(
        validators=[MinValueValidator(1900), MaxValueValidator(2100)],
        help_text="Inserisci un anno valido (es. 2002, 2015)."
    )
    numero_maglia = models.PositiveIntegerField(
        help_text="Numero di maglia del giocatore."
    )
    squadra = models.CharField(max_length=100)
    nome = models.CharField(max_length=50, blank=True, null=True)
    cognome = models.CharField(max_length=50, blank=True, null=True)
    struttura_fisica = models.CharField(max_length=100, blank=True, null=True)
    PIEDE_CHOICES = [
        ("Destro", "Destro"),
        ("Sinistro", "Sinistro"),
    ]
    piede = models.CharField(max_length=10, choices=PIEDE_CHOICES, blank=True, null=True)
    capacita_fisica = models.TextField(blank=True, null=True)
    capacita_cognitiva = models.TextField(blank=True, null=True)
    descrizione_match = models.TextField(
        help_text="Breve descrizione della partita in cui il giocatore è stato visto."
    )
    RUOLI_CHOICES = [
        ('Portiere', 'Portiere'),
        ('Difensore', 'Difensore'),
        ('Centrocampista', 'Centrocampista'),
        ('Attaccante', 'Attaccante'),
    ]
    ruolo = models.CharField(max_length=20, choices=RUOLI_CHOICES)
    data_operazione = models.DateTimeField(auto_now_add=True)
    collaboratore = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        help_text="Collaboratore che ha registrato l'operazione (segnalazione o visione)."
    )

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.numero_maglia} - {self.squadra} ({self.anno_nascita})"


# Modello per le segnalazioni dei giocatori
class Segnalato(GiocatoreBase):
    STATUS_CHOICES = [
        ('Nuova', 'Nuova'),
        ('In Revisione', 'In Revisione'),
        ('Approvata', 'Approvata'),
        ('Scartata', 'Scartata'),
    ]
    stato = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Nuova')
    descrizione_breve = models.TextField(blank=True, null=True)
    data_segnalazione = models.DateField(
        verbose_name="Giorno in cui l'hai visto",
        help_text="Data in cui hai visto il giocatore giocare.",
        default=timezone.now
    )

    class Meta:
        verbose_name = "Giocatore Segnalato"
        verbose_name_plural = "Giocatori Segnalati"


# Modello per i giocatori visionati
class Visionato(GiocatoreBase):
    descrizione_dettagliata = models.TextField(
        help_text="Descrizione dettagliata fornita dal collaboratore.",
        blank=True, null=True
    )
    telefono_genitore = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        validators=[RegexValidator(regex=r'^\+39\d{9,12}$', message="Inserisci un numero valido in formato italiano.")]
    )
    data_segnalazione = models.DateField(
        verbose_name="Giorno in cui l'hai visto",
        help_text="Data in cui hai visto il giocatore giocare.",
        default=timezone.now
    )

    class Meta:
        verbose_name = "Giocatore Visionato"
        verbose_name_plural = "Giocatori Visionati"
