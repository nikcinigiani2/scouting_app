// src/Ricerca.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Alert,
  DialogContentText,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent
} from '@mui/material';
import { Search, FilterList, ExpandMore, Person, Visibility } from '@mui/icons-material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import axios from './utils/auth';
import logoFloria from './assets/logo_floria.png';
import abstractBackground from './assets/abstract-blue-bg.png';
import { clearTokens } from './utils/auth';

const RUOLI = ['Portiere', 'Difensore', 'Centrocampista', 'Attaccante'];
const PIEDI = ['Destro', 'Sinistro'];

function Ricerca() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    squadra: '',
    anno: '',
    ruolo: '',
    piede: '',
    tipo: 'tutti'
  });
  const [results, setResults] = useState({
    segnalati: [],
    visionati: [],
    tutti: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGiocatore, setSelectedGiocatore] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters.squadra) params.append('squadra', filters.squadra);
      if (filters.anno) params.append('anno', filters.anno);
      if (filters.ruolo) params.append('ruolo', filters.ruolo);
      if (filters.piede) params.append('piede', filters.piede);
      if (filters.tipo !== 'tutti') params.append('tipo', filters.tipo);
      const response = await axios.get(`http://127.0.0.1:8000/api/ricerca/?${params}`);
      setResults(response.data);
    } catch (err) {
      console.error('Errore nella ricerca:', err);
      setError('Errore durante la ricerca');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleGiocatoreClick = (giocatore) => {
    setSelectedGiocatore(giocatore);
    setDetailOpen(true);
  };

  const clearFilters = () => {
    setFilters({
      squadra: '',
      anno: '',
      ruolo: '',
      piede: '',
      tipo: 'tutti'
    });
  };

  const getTipoIcon = (tipo) => {
    return tipo === 'segnalato' ? <Person color="warning" /> : <Visibility color="success" />;
  };

  const getTipoChip = (tipo) => {
    return tipo === 'segnalato'
      ? <Chip label="Segnalato" color="warning" size="small" />
      : <Chip label="Visionato" color="success" size="small" />;
  };

  const handleLogout = () => {
    clearTokens();
    navigate('/login', { replace: true });
  };

  return (
    <Box
      component="main"
      sx={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url(${abstractBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Navbar */}
      <AppBar
        position="absolute"
        color="transparent"
        elevation={0}
        sx={{ bgcolor: 'rgba(255,255,255,0.9)', zIndex: theme => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ px: 2, height: 64, justifyContent: 'space-between' }}>
          <Box onClick={() => navigate('/home')} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <img src={logoFloria} alt="Floria" style={{ height: 40, marginRight: 8 }} />
            <Typography variant="h6" sx={{ color: '#1565c0', fontWeight: 700 }}>
              Floria Scouting
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button onClick={() => navigate('/notereferti')} variant="text" sx={{ color: '#1565c0', textTransform: 'none' }}>
              Note & Referti
            </Button>
            <Button onClick={() => navigate('/dashboard')} variant="text" sx={{ color: '#1565c0', textTransform: 'none' }}>
              Scouting
            </Button>
            <Button
              onClick={handleLogout}
              variant="outlined"
              sx={{
                borderColor: '#1565c0',
                color: '#1565c0',
                borderRadius: '999px',
                textTransform: 'none',
                px: 2,
                '&:hover': { backgroundColor: 'rgba(21,101,192,0.08)' }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Back button sotto navbar */}
      <Box sx={{ pt: 12, px: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          sx={{
            bgcolor: 'rgba(255,255,255,0.9)',
            color: '#1565c0',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            px: 2,
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
          }}
        >
          Torna indietro
        </Button>
      </Box>

      {/* Titolo sezione */}
      <Typography
        variant="h4"
        sx={{ color: '#fff !important', fontWeight: 700, textAlign: 'center', mt: 2, mb: 2 }}
      >
        Ricerca Giocatori
      </Typography>

      {/* Wrapper contenuti */}
      <Box sx={{ flexGrow: 1, px: { xs: 2, sm: 4 }, pb: 4 }}>
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            maxWidth: 1000,
            width: '100%',
            mx: 'auto',
            bgcolor: 'rgba(255,255,255,0.9)'
          }}
        >
          {/* Barra di ricerca principale */}
          <Box sx={{ mb: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <TextField
                label="Cerca giocatori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                placeholder="Nome, cognome, squadra, descrizione..."
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                sx={{
                  bgcolor: '#fff',
                  borderRadius: 1,
                  '& .MuiInputBase-input': { color: '#1565c0', fontWeight: 500 }
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
                startIcon={<Search />}
                sx={{ minWidth: 140, borderRadius: '999px', fontWeight: 600 }}
              >
                {loading ? 'Ricerca...' : 'Cerca'}
              </Button>
            </Stack>
          </Box>

          {/* Filtri avanzati */}
          <Accordion sx={{ mb: 3, bgcolor: '#fff', borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Stack direction="row" spacing={1} alignItems="center">
                <FilterList />
                <Typography>Filtri Avanzati</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Squadra"
                    value={filters.squadra}
                    onChange={(e) => handleFilterChange('squadra', e.target.value)}
                    fullWidth
                    placeholder="Nome squadra..."
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Anno di nascita"
                    value={filters.anno}
                    onChange={(e) => handleFilterChange('anno', e.target.value)}
                    fullWidth
                    type="number"
                    placeholder="es. 2005"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Ruolo</InputLabel>
                    <Select
                      value={filters.ruolo}
                      label="Ruolo"
                      onChange={(e) => handleFilterChange('ruolo', e.target.value)}
                    >
                      <MenuItem value="">Tutti i ruoli</MenuItem>
                      {RUOLI.map(ruolo => (
                        <MenuItem key={ruolo} value={ruolo}>{ruolo}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Piede</InputLabel>
                    <Select
                      value={filters.piede}
                      label="Piede"
                      onChange={(e) => handleFilterChange('piede', e.target.value)}
                    >
                      <MenuItem value="">Entrambi</MenuItem>
                      {PIEDI.map(piede => (
                        <MenuItem key={piede} value={piede}>{piede}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                      value={filters.tipo}
                      label="Tipo"
                      onChange={(e) => handleFilterChange('tipo', e.target.value)}
                    >
                      <MenuItem value="tutti">Tutti</MenuItem>
                      <MenuItem value="segnalati">Solo Segnalati</MenuItem>
                      <MenuItem value="visionati">Solo Visionati</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button variant="outlined" onClick={clearFilters} fullWidth sx={{ height: 56 }}>
                    Pulisci Filtri
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Statistiche risultati */}
          {results.count_totale > 0 && (
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
                <Chip label={`${results.count_totale} risultati totali`} color="primary" variant="outlined" />
                <Chip label={`${results.count_segnalati} segnalati`} color="warning" variant="outlined" />
                <Chip label={`${results.count_visionati} visionati`} color="success" variant="outlined" />
              </Stack>
            </Box>
          )}

          {/* Messaggi di errore */}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* Risultati della ricerca */}
          {results.tutti.length > 0 ? (
            <Grid container spacing={2}>
              {results.tutti.map((giocatore) => (
                <Grid item xs={12} sm={6} md={4} key={`${giocatore.tipo}-${giocatore.id}`}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 2,
                      bgcolor: '#fff',
                      '&:hover': { boxShadow: 4 },
                      border: giocatore.tipo === 'segnalato' ? '2px solid #ff9800' : '2px solid #4caf50'
                    }}
                    onClick={() => handleGiocatoreClick(giocatore)}
                  >
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Typography variant="h6" component="div">
                          {giocatore.nome || ''} {giocatore.cognome || ''}
                        </Typography>
                        {getTipoIcon(giocatore.tipo)}
                      </Stack>

                      <Typography color="text.secondary" gutterBottom>
                        {giocatore.squadra} • {giocatore.anno_nascita}
                      </Typography>

                      <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                        <Chip label={`Maglia ${giocatore.numero_maglia}`} size="small" />
                        <Chip label={giocatore.ruolo} size="small" variant="outlined" />
                        {getTipoChip(giocatore.tipo)}
                      </Stack>

                      {giocatore.piede && (
                        <Typography variant="body2" color="text.secondary">
                          Piede: {giocatore.piede}
                        </Typography>
                      )}

                      {giocatore.struttura_fisica && (
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {giocatore.struttura_fisica}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : !loading && searchTerm && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                Nessun risultato trovato
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Prova a modificare i criteri di ricerca
              </Typography>
            </Box>
          )}

          {/* Dialog dettagli giocatore */}
          <Dialog
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>
              <Stack direction="row" alignItems="center" spacing={1}>
                {getTipoIcon(selectedGiocatore?.tipo)}
                <Typography>
                  Dettagli {selectedGiocatore?.tipo === 'segnalato' ? 'Segnalato' : 'Visionato'}
                </Typography>
                {getTipoChip(selectedGiocatore?.tipo)}
              </Stack>
            </DialogTitle>
            <DialogContent>
              {selectedGiocatore && (
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Stack spacing={2}>
                        <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
                          <Typography variant="subtitle2" fontWeight="bold">Nome:</Typography>
                          <Typography>{selectedGiocatore.nome || '-'}</Typography>
                        </Box>
                        <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: '#ffffff' }}>
                          <Typography variant="subtitle2" fontWeight="bold">Squadra:</Typography>
                          <Typography>{selectedGiocatore.squadra}</Typography>
                        </Box>
                        <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
                          <Typography variant="subtitle2" fontWeight="bold">Numero maglia:</Typography>
                          <Typography>{selectedGiocatore.numero_maglia}</Typography>
                        </Box>
                        <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: '#ffffff' }}>
                          <Typography variant="subtitle2" fontWeight="bold">Piede:</Typography>
                          <Typography>{selectedGiocatore.piede || '-'}</Typography>
                        </Box>
                        <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
                          <Typography variant="subtitle2" fontWeight="bold">Capacità fisica:</Typography>
                          <Typography>{selectedGiocatore.capacita_fisica || '-'}</Typography>
                        </Box>
                        <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: '#ffffff' }}>
                          <Typography variant="subtitle2" fontWeight="bold">Giorno in cui l'hai visto:</Typography>
                          <Typography>{selectedGiocatore.data_segnalazione}</Typography>
                        </Box>
                        {selectedGiocatore.tipo === 'visionato' && (
                          <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
                            <Typography variant="subtitle2" fontWeight="bold">Data di revisione:</Typography>
                            <Typography>{selectedGiocatore.data_revisione}</Typography>
                          </Box>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={6}>
                      <Stack spacing={2}>
                        <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
                          <Typography variant="subtitle2" fontWeight="bold">Cognome:</Typography>
                          <Typography>{selectedGiocatore.cognome || '-'}</Typography>
                        </Box>
                        <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: '#ffffff' }}>
                          <Typography variant="subtitle2" fontWeight="bold">Anno di nascita:</Typography>
                          <Typography>{selectedGiocatore.anno_nascita}</Typography>
                        </Box>
                        <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
                          <Typography variant="subtitle2" fontWeight="bold">Ruolo:</Typography>
                          <Typography>{selectedGiocatore.ruolo}</Typography>
                        </Box>
                        <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: '#ffffff' }}>
                          <Typography variant="subtitle2" fontWeight="bold">Struttura fisica:</Typography>
                          <Typography>{selectedGiocatore.struttura_fisica || '-'}</Typography>
                        </Box>
                        <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
                          <Typography variant="subtitle2" fontWeight="bold">Capacità cognitiva:</Typography>
                          <Typography>{selectedGiocatore.capacita_cognitiva || '-'}</Typography>
                        </Box>
                        <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: '#ffffff' }}>
                          <Typography variant="subtitle2" fontWeight="bold">Telefono genitore:</Typography>
                          <Typography>{selectedGiocatore.telefono_genitore || '-'}</Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
                        <Typography variant="subtitle2" fontWeight="bold">Descrizione match:</Typography>
                        <Typography>{selectedGiocatore.descrizione_match || '-'}</Typography>
                      </Box>
                    </Grid>
                    {selectedGiocatore.tipo === 'visionato' && selectedGiocatore.descrizione_dettagliata && (
                      <Grid item xs={12}>
                        <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: '#ffffff' }}>
                          <Typography variant="subtitle2" fontWeight="bold">Descrizione dettagliata:</Typography>
                          <Typography>{selectedGiocatore.descrizione_dettagliata}</Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailOpen(false)}>Chiudi</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </Box>
  );
}

export default Ricerca;
