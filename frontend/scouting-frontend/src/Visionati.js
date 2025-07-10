import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, List, ListItem, ListItemText, Paper, Stack, 
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Alert, 
  DialogContentText, Grid
} from '@mui/material';
import axios from './utils/auth';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const initialForm = {
  nome: '',
  cognome: '',
  squadra: '',
  anno_nascita: '',
  numero_maglia: '',
  struttura_fisica: '',
  piede: '',
  capacita_fisica: '',
  capacita_cognitiva: '',
  ruolo: '',
  descrizione_match: '',
  data_segnalazione: '',
  telefono_genitore: '',
  descrizione_dettagliata: '',
  data_revisione: '',
  note_gara: null,
};

const RUOLI = ['Portiere', 'Difensore', 'Centrocampista', 'Attaccante'];
const PIEDI = ['Destro', 'Sinistro'];

function Visionati() {
  const [search, setSearch] = useState('');
  const [visionati, setVisionati] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Stati per le funzionalità di dettaglio/modifica
  const [selectedGiocatore, setSelectedGiocatore] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editForm, setEditForm] = useState(initialForm);

  const navigate = useNavigate();

  const fetchVisionati = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://127.0.0.1:8000/api/visionati/');
      setVisionati(res.data);
    } catch (err) {
      console.error('Errore nel recupero dei visionati:', err);
      setError('Errore nel recupero dei visionati');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisionati();
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const filtered = visionati.filter(g =>
    (g.nome + ' ' + g.cognome + ' ' + g.squadra + ' ' + g.anno_nascita).toLowerCase().includes(search.toLowerCase())
  );

  const handleOpen = () => { setForm(initialForm); setOpen(true); setError(null); setSuccess(null); };
  const handleClose = () => setOpen(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      setError('Il file supera i 2MB!');
      return;
    }
    setForm({ ...form, note_gara: file });
  };
  const handleEditFileChange = e => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      setError('Il file supera i 2MB!');
      return;
    }
    setEditForm({ ...editForm, note_gara: file });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null); 
    setSuccess(null);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      await axios.post('http://127.0.0.1:8000/api/visionati/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Giocatore visionato aggiunto con successo!');
      fetchVisionati();
      setOpen(false);
    } catch (err) {
      console.error('Errore nell\'inserimento:', err);
      if (err.response && err.response.data) {
        setError(
          typeof err.response.data === 'string'
            ? err.response.data
            : JSON.stringify(err.response.data)
        );
      } else {
        setError('Errore nell\'inserimento. Controlla i dati.');
      }
    }
  };

  // Funzioni per gestire il click sul giocatore
  const handleGiocatoreClick = (giocatore) => {
    setSelectedGiocatore(giocatore);
    setEditForm({
      nome: giocatore.nome || '',
      cognome: giocatore.cognome || '',
      squadra: giocatore.squadra || '',
      anno_nascita: giocatore.anno_nascita || '',
      numero_maglia: giocatore.numero_maglia || '',
      struttura_fisica: giocatore.struttura_fisica || '',
      piede: giocatore.piede || '',
      capacita_fisica: giocatore.capacita_fisica || '',
      capacita_cognitiva: giocatore.capacita_cognitiva || '',
      ruolo: giocatore.ruolo || '',
      descrizione_match: giocatore.descrizione_match || '',
      data_segnalazione: giocatore.data_segnalazione || '',
      telefono_genitore: giocatore.telefono_genitore || '',
      descrizione_dettagliata: giocatore.descrizione_dettagliata || '',
      data_revisione: giocatore.data_revisione || '',
      note_gara: giocatore.note_gara || null,
    });
    setDetailOpen(true);
    setEditMode(false);
  };

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEdit = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      await axios.put(`http://127.0.0.1:8000/api/visionati/${selectedGiocatore.id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Giocatore modificato con successo!');
      fetchVisionati();
      setEditMode(false);
      setDetailOpen(false);
    } catch (err) {
      console.error('Errore nella modifica:', err);
      if (err.response && err.response.data) {
        setError(
          typeof err.response.data === 'string'
            ? err.response.data
            : JSON.stringify(err.response.data)
        );
      } else {
        setError('Errore nella modifica. Controlla i dati.');
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/visionati/${selectedGiocatore.id}/`);
      setSuccess('Giocatore eliminato con successo!');
      fetchVisionati();
      setDeleteConfirmOpen(false);
      setDetailOpen(false);
    } catch (err) {
      console.error('Errore nell\'eliminazione:', err);
      setError('Errore nell\'eliminazione del giocatore.');
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/home')} sx={{ mb: 2, bgcolor: '#fff', color: 'primary.main', fontWeight: 600 }}>
        Indietro
      </Button>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Giocatori Visionati</Typography>
          <Button variant="contained" color="primary" onClick={handleOpen}>Aggiungi visionato</Button>
        </Stack>
        <TextField
          label="Cerca giocatore"
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth
          margin="normal"
        />
        {loading && <Typography sx={{ mt: 2 }}>Caricamento...</Typography>}
        <List>
          {filtered.map(g => (
            <ListItem key={g.id} button onClick={() => handleGiocatoreClick(g)} sx={{ mb: 2, borderRadius: 3, boxShadow: 3, background: '#fff', minHeight: 80, p: 3, border: '2px solid #e0e0e0', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6, borderColor: '#00408022' } }}>
              <ListItemText
                primary={<Typography variant="h6" fontWeight={700} color="primary.main">{`${g.nome || ''} ${g.cognome || ''}`}</Typography>}
                secondary={<>
                  <Typography variant="body2" color="text.secondary">{g.squadra}, {g.anno_nascita} | Maglia: {g.numero_maglia} | Ruolo: {g.ruolo}</Typography>
                  <Typography variant="caption" color="text.disabled">ID: {g.id}</Typography>
                </>}
              />
            </ListItem>
          ))}
        </List>

        {/* Dialog per dettagli/modifica giocatore */}
        <Dialog 
          open={detailOpen} 
          onClose={() => setDetailOpen(false)} 
          fullWidth 
          maxWidth="md"
          disableEscapeKeyDown={editMode}
          disableBackdropClick={editMode}
        >
          <DialogTitle>
            {editMode ? 'Modifica Giocatore Visionato' : 'Dettagli Giocatore Visionato'}
          </DialogTitle>
          <DialogContent>
            {editMode ? (
              <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <form id="edit-form" onSubmit={handleEdit}>
                  <Stack spacing={2} mt={1}>
                    <TextField label="Nome" name="nome" value={editForm.nome} onChange={handleEditChange} fullWidth />
                    <TextField label="Cognome" name="cognome" value={editForm.cognome} onChange={handleEditChange} fullWidth />
                    <TextField label="Squadra" name="squadra" value={editForm.squadra} onChange={handleEditChange} required fullWidth />
                    <TextField label="Anno di nascita" name="anno_nascita" value={editForm.anno_nascita} onChange={handleEditChange} required type="number" fullWidth />
                    <TextField label="Numero maglia" name="numero_maglia" value={editForm.numero_maglia} onChange={handleEditChange} required type="number" fullWidth />
                    <TextField label="Struttura fisica" name="struttura_fisica" value={editForm.struttura_fisica} onChange={handleEditChange} fullWidth />
                    <TextField select label="Piede" name="piede" value={editForm.piede} onChange={handleEditChange} fullWidth>
                      <MenuItem value="">-</MenuItem>
                      {PIEDI.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                    </TextField>
                    <TextField select label="Ruolo" name="ruolo" value={editForm.ruolo} onChange={handleEditChange} required fullWidth>
                      <MenuItem value="">-</MenuItem>
                      {RUOLI.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                    </TextField>
                    <TextField label="Capacità fisica" name="capacita_fisica" value={editForm.capacita_fisica} onChange={handleEditChange} fullWidth />
                    <TextField label="Capacità cognitiva" name="capacita_cognitiva" value={editForm.capacita_cognitiva} onChange={handleEditChange} fullWidth />
                    <TextField label="Descrizione match" name="descrizione_match" value={editForm.descrizione_match} onChange={handleEditChange} multiline rows={3} fullWidth />
                    <TextField label="Descrizione dettagliata" name="descrizione_dettagliata" value={editForm.descrizione_dettagliata} onChange={handleEditChange} multiline rows={3} fullWidth />
                    <TextField
                      label="Giorno in cui l'hai visto"
                      name="data_segnalazione"
                      type="date"
                      value={editForm.data_segnalazione}
                      onChange={handleEditChange}
                      required
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                    <TextField
                      label="Data di revisione"
                      name="data_revisione"
                      type="date"
                      value={editForm.data_revisione}
                      onChange={handleEditChange}
                      required
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                    <TextField
                      label="Numero cellulare genitore"
                      name="telefono_genitore"
                      value={editForm.telefono_genitore}
                      onChange={handleEditChange}
                      placeholder="+39XXXXXXXXX"
                      helperText="Formato: +39 seguito da 9-12 cifre"
                      fullWidth
                    />
                    <Button variant="outlined" component="label">
                      Carica Note Gara (PDF, max 2MB)
                      <input type="file" accept="application/pdf" hidden onChange={handleEditFileChange} />
                    </Button>
                    {editForm.note_gara && <Typography variant="body2">File selezionato: {editForm.note_gara.name}</Typography>}
                  </Stack>
                </form>
              </Box>
            ) : (
              <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <Stack spacing={2}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <Typography variant="subtitle2" fontWeight="bold">Nome:</Typography>
                    <Typography>{selectedGiocatore?.nome || '-'}</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#ffffff'
                  }}>
                    <Typography variant="subtitle2" fontWeight="bold">Cognome:</Typography>
                    <Typography>{selectedGiocatore?.cognome || '-'}</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <Typography variant="subtitle2" fontWeight="bold">Squadra:</Typography>
                    <Typography>{selectedGiocatore?.squadra}</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#ffffff'
                  }}>
                    <Typography variant="subtitle2" fontWeight="bold">Anno di nascita:</Typography>
                    <Typography>{selectedGiocatore?.anno_nascita}</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <Typography variant="subtitle2" fontWeight="bold">Numero maglia:</Typography>
                    <Typography>{selectedGiocatore?.numero_maglia}</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#ffffff'
                  }}>
                    <Typography variant="subtitle2" fontWeight="bold">Ruolo:</Typography>
                    <Typography>{selectedGiocatore?.ruolo}</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <Typography variant="subtitle2" fontWeight="bold">Piede:</Typography>
                    <Typography>{selectedGiocatore?.piede || '-'}</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#ffffff'
                  }}>
                    <Typography variant="subtitle2" fontWeight="bold">Struttura fisica:</Typography>
                    <Typography>{selectedGiocatore?.struttura_fisica || '-'}</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <Typography variant="subtitle2" fontWeight="bold">Capacità fisica:</Typography>
                    <Typography>{selectedGiocatore?.capacita_fisica || '-'}</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#ffffff'
                  }}>
                    <Typography variant="subtitle2" fontWeight="bold">Capacità cognitiva:</Typography>
                    <Typography>{selectedGiocatore?.capacita_cognitiva || '-'}</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <Typography variant="subtitle2" fontWeight="bold">Giorno in cui l'hai visto:</Typography>
                    <Typography>{selectedGiocatore?.data_segnalazione}</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#ffffff'
                  }}>
                    <Typography variant="subtitle2" fontWeight="bold">Data di revisione:</Typography>
                    <Typography>{selectedGiocatore?.data_revisione}</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <Typography variant="subtitle2" fontWeight="bold">Telefono genitore:</Typography>
                    <Typography>{selectedGiocatore?.telefono_genitore || '-'}</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#ffffff'
                  }}>
                    <Typography variant="subtitle2" fontWeight="bold">ID Giocatore:</Typography>
                    <Typography>{selectedGiocatore?.id || '-'}</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <Typography variant="subtitle2" fontWeight="bold">Descrizione match:</Typography>
                    <Typography>{selectedGiocatore?.descrizione_match || '-'}</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#ffffff'
                  }}>
                    <Typography variant="subtitle2" fontWeight="bold">Descrizione dettagliata:</Typography>
                    <Typography>{selectedGiocatore?.descrizione_dettagliata || '-'}</Typography>
                  </Box>
                  {/* Nei dettagli mostra il link se presente */}
                  {selectedGiocatore?.note_gara && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold">Note Gara:</Typography>
                      <a href={selectedGiocatore.note_gara} target="_blank" rel="noopener noreferrer">Visualizza PDF</a>
                    </Box>
                  )}
                </Stack>
              </Box>
            )}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
            {editMode ? (
              <>
                <Button type="button" onClick={() => setEditMode(false)}>Annulla</Button>
                <Button type="submit" form="edit-form" variant="contained">Salva Modifiche</Button>
              </>
            ) : (
              <>
                <Button color="error" onClick={() => setDeleteConfirmOpen(true)}>Elimina Giocatore</Button>
                <Button 
                  type="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setEditMode(true);
                  }}
                >
                  Modifica
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>

        {/* Dialog di conferma eliminazione */}
        <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
          <DialogTitle sx={{ color: 'error.main' }}>Conferma Eliminazione</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Sei sicuro di voler eliminare questo giocatore? Questa azione non può essere annullata.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Annulla</Button>
            <Button onClick={handleDelete} color="error" variant="contained">Elimina</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog per aggiungere nuovo giocatore visionato */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Aggiungi nuovo giocatore visionato</DialogTitle>
          <DialogContent>
            <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <form id="visionato-form" onSubmit={handleSubmit}>
                <Stack spacing={2} mt={1}>
                  <TextField label="Nome" name="nome" value={form.nome} onChange={handleChange} fullWidth />
                  <TextField label="Cognome" name="cognome" value={form.cognome} onChange={handleChange} fullWidth />
                  <TextField label="Squadra" name="squadra" value={form.squadra} onChange={handleChange} required fullWidth />
                  <TextField label="Anno di nascita" name="anno_nascita" value={form.anno_nascita} onChange={handleChange} required type="number" fullWidth />
                  <TextField label="Numero maglia" name="numero_maglia" value={form.numero_maglia} onChange={handleChange} required type="number" fullWidth />
                  <TextField label="Struttura fisica" name="struttura_fisica" value={form.struttura_fisica} onChange={handleChange} fullWidth />
                  <TextField select label="Piede" name="piede" value={form.piede} onChange={handleChange} fullWidth>
                    <MenuItem value="">-</MenuItem>
                    {PIEDI.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                  </TextField>
                  <TextField label="Capacità fisica" name="capacita_fisica" value={form.capacita_fisica} onChange={handleChange} fullWidth />
                  <TextField label="Capacità cognitiva" name="capacita_cognitiva" value={form.capacita_cognitiva} onChange={handleChange} fullWidth />
                  <TextField select label="Ruolo" name="ruolo" value={form.ruolo} onChange={handleChange} required fullWidth>
                    <MenuItem value="">-</MenuItem>
                    {RUOLI.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                  </TextField>
                  <TextField label="Descrizione match" name="descrizione_match" value={form.descrizione_match} onChange={handleChange} multiline rows={3} fullWidth />
                  <TextField label="Descrizione dettagliata" name="descrizione_dettagliata" value={form.descrizione_dettagliata} onChange={handleChange} multiline rows={3} fullWidth />
                  <TextField
                    label="Giorno in cui l'hai visto"
                    name="data_segnalazione"
                    type="date"
                    value={form.data_segnalazione}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                  <TextField
                    label="Data di revisione"
                    name="data_revisione"
                    type="date"
                    value={form.data_revisione}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                  <TextField
                    label="Numero cellulare genitore"
                    name="telefono_genitore"
                    value={form.telefono_genitore}
                    onChange={handleChange}
                    placeholder="+39XXXXXXXXX"
                    helperText="Formato: +39 seguito da 9-12 cifre"
                    fullWidth
                  />
                  <Button variant="outlined" component="label">
                    Carica Note Gara (PDF, max 2MB)
                    <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
                  </Button>
                  {form.note_gara && <Typography variant="body2">File selezionato: {form.note_gara.name}</Typography>}
                  {error && <Alert severity="error">{error}</Alert>}
                  {success && <Alert severity="success">{success}</Alert>}
                </Stack>
              </form>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annulla</Button>
            <Button type="submit" form="visionato-form" variant="contained">Salva</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}

export default Visionati; 