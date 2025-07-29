from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.core.exceptions import ValidationError

def validate_pdf(value):
    if not value.name.lower().endswith('.pdf'):
        raise ValidationError('Il file deve essere un PDF.')
    limit = 2 * 1024 * 1024  # 2MB
    if value.size > limit:
        raise ValidationError('Il file non può superare i 2MB.')

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
    telefono_genitore = models.CharField(
        max_length=16,
        blank=True,
        null=True,
        verbose_name="Numero cellulare genitore",
        validators=[RegexValidator(regex=r'^\+39\d{9,12}$', message="Inserisci un numero valido in formato italiano (+39 seguito da 9-12 cifre).")]
    )
    note_gara = models.FileField(
        upload_to='note_gara/',
        null=True,
        blank=True,
        validators=[validate_pdf],
        help_text="Carica un PDF (max 2MB) come Note Gara"
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
    data_segnalazione = models.DateField(
        verbose_name="Giorno in cui l'hai visto",
        help_text="Data in cui hai visto il giocatore giocare.",
        default=timezone.now
    )
    data_revisione = models.DateField(
        verbose_name="Data di revisione",
        help_text="Data in cui il giocatore è stato convertito da segnalato a visionato.",
        default=timezone.now
    )

    class Meta:
        verbose_name = "Giocatore Visionato"
        verbose_name_plural = "Giocatori Visionati"


class Nota(models.Model):
    ANNI = [(a, str(a)) for a in range(2010, 2017)]
    anno = models.PositiveIntegerField(choices=ANNI)
    file = models.FileField(upload_to='note_referti/')
    nome = models.CharField(max_length=255)
    data_caricamento = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} ({self.anno})"
