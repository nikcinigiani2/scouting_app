import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, List, ListItem, ListItemText, Paper, Stack, 
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Alert, 
  DialogContentText, Grid
} from '@mui/material';
import axios from './utils/auth';

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
};

const RUOLI = ['Portiere', 'Difensore', 'Centrocampista', 'Attaccante'];
const PIEDI = ['Destro', 'Sinistro'];

function Segnalati() {
  const [search, setSearch] = useState('');
  const [segnalati, setSegnalati] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Nuovi stati per le funzionalità richieste
  const [selectedGiocatore, setSelectedGiocatore] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editForm, setEditForm] = useState(initialForm);

  const fetchSegnalati = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://127.0.0.1:8001/api/segnalati/');
      setSegnalati(res.data);
    } catch (err) {
      console.error('Errore nel recupero dei segnalati:', err);
      setError('Errore nel recupero dei segnalati');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSegnalati(); }, []);

  const filtered = segnalati.filter(g =>
    (g.nome + ' ' + g.cognome + ' ' + g.squadra + ' ' + g.anno_nascita).toLowerCase().includes(search.toLowerCase())
  );

  const handleOpen = () => { setForm(initialForm); setOpen(true); setError(null); setSuccess(null); };
  const handleClose = () => setOpen(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null); 
    setSuccess(null);
    try {
      await axios.post('http://127.0.0.1:8001/api/segnalati/', form);
      setSuccess('Giocatore segnalato con successo!');
      fetchSegnalati();
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

  // Nuove funzioni per gestire il click sul giocatore
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
      await axios.put(`http://127.0.0.1:8001/api/segnalati/${selectedGiocatore.id}/`, editForm);
      setSuccess('Giocatore modificato con successo!');
      fetchSegnalati();
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
      await axios.delete(`http://127.0.0.1:8001/api/segnalati/${selectedGiocatore.id}/`);
      setSuccess('Giocatore eliminato con successo!');
      fetchSegnalati();
      setDeleteConfirmOpen(false);
      setDetailOpen(false);
    } catch (err) {
      console.error('Errore nell\'eliminazione:', err);
      setError('Errore nell\'eliminazione del giocatore.');
    }
  };

  const handlePassaAVisionato = async () => {
    try {
      await axios.post(`http://127.0.0.1:8001/api/converti/${selectedGiocatore.id}/`, {
        descrizione_dettagliata: editForm.descrizione_match,
        telefono_genitore: ''
      });
      setSuccess('Giocatore convertito in visionato con successo!');
      fetchSegnalati();
      setDetailOpen(false);
    } catch (err) {
      console.error('Errore nella conversione:', err);
      setError('Errore nella conversione in visionato.');
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Giocatori Segnalati</Typography>
          <Button variant="contained" color="primary" onClick={handleOpen}>Segnala giocatore</Button>
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
            <ListItem key={g.id} button onClick={() => handleGiocatoreClick(g)}>
              <ListItemText
                primary={`${g.nome || ''} ${g.cognome || ''} (${g.squadra}, ${g.anno_nascita})`}
                secondary={`ID: ${g.id} - Maglia: ${g.numero_maglia} - Ruolo: ${g.ruolo}`}
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
            {editMode ? 'Modifica Giocatore' : 'Dettagli Giocatore'}
          </DialogTitle>
          <DialogContent>
            {editMode ? (
                             <form id="edit-form" onSubmit={handleEdit}>
                 <Grid container spacing={2} mt={1}>
                   <Grid item xs={6}>
                     <TextField label="Nome" name="nome" value={editForm.nome} onChange={handleEditChange} fullWidth />
                   </Grid>
                   <Grid item xs={6}>
                     <TextField label="Cognome" name="cognome" value={editForm.cognome} onChange={handleEditChange} fullWidth />
                   </Grid>
                   <Grid item xs={6}>
                     <TextField label="Squadra" name="squadra" value={editForm.squadra} onChange={handleEditChange} required fullWidth />
                   </Grid>
                   <Grid item xs={6}>
                     <TextField label="Anno di nascita" name="anno_nascita" value={editForm.anno_nascita} onChange={handleEditChange} required type="number" fullWidth />
                   </Grid>
                   <Grid item xs={6}>
                     <TextField label="Numero maglia" name="numero_maglia" value={editForm.numero_maglia} onChange={handleEditChange} required type="number" fullWidth />
                   </Grid>
                   <Grid item xs={6}>
                     <TextField label="Struttura fisica" name="struttura_fisica" value={editForm.struttura_fisica} onChange={handleEditChange} fullWidth />
                   </Grid>
                   <Grid item xs={6}>
                     <TextField select label="Piede" name="piede" value={editForm.piede} onChange={handleEditChange} fullWidth>
                       <MenuItem value="">-</MenuItem>
                       {PIEDI.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                     </TextField>
                   </Grid>
                   <Grid item xs={6}>
                     <TextField select label="Ruolo" name="ruolo" value={editForm.ruolo} onChange={handleEditChange} required fullWidth>
                       <MenuItem value="">-</MenuItem>
                       {RUOLI.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                     </TextField>
                   </Grid>
                   <Grid item xs={6}>
                     <TextField label="Capacità fisica" name="capacita_fisica" value={editForm.capacita_fisica} onChange={handleEditChange} fullWidth />
                   </Grid>
                   <Grid item xs={6}>
                     <TextField label="Capacità cognitiva" name="capacita_cognitiva" value={editForm.capacita_cognitiva} onChange={handleEditChange} fullWidth />
                   </Grid>
                   <Grid item xs={12}>
                     <TextField label="Descrizione match" name="descrizione_match" value={editForm.descrizione_match} onChange={handleEditChange} multiline rows={3} fullWidth />
                   </Grid>
                   <Grid item xs={12}>
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
                   </Grid>
                 </Grid>
               </form>
                         ) : (
               <Box>
                 <Grid container spacing={3}>
                   {/* Colonna sinistra */}
                   <Grid item xs={6}>
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
                         <Typography variant="subtitle2" fontWeight="bold">Squadra:</Typography>
                         <Typography>{selectedGiocatore?.squadra}</Typography>
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
                         <Typography variant="subtitle2" fontWeight="bold">Piede:</Typography>
                         <Typography>{selectedGiocatore?.piede || '-'}</Typography>
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
                         <Typography variant="subtitle2" fontWeight="bold">Giorno in cui l'hai visto:</Typography>
                         <Typography>{selectedGiocatore?.data_segnalazione}</Typography>
                       </Box>
                     </Stack>
                   </Grid>
                   
                   {/* Colonna destra */}
                   <Grid item xs={6}>
                     <Stack spacing={2}>
                       <Box sx={{ 
                         p: 2, 
                         borderRadius: 2, 
                         border: '1px solid #e0e0e0',
                         backgroundColor: '#f8f9fa'
                       }}>
                         <Typography variant="subtitle2" fontWeight="bold">Cognome:</Typography>
                         <Typography>{selectedGiocatore?.cognome || '-'}</Typography>
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
                         <Typography variant="subtitle2" fontWeight="bold">Ruolo:</Typography>
                         <Typography>{selectedGiocatore?.ruolo}</Typography>
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
                         <Typography variant="subtitle2" fontWeight="bold">Capacità cognitiva:</Typography>
                         <Typography>{selectedGiocatore?.capacita_cognitiva || '-'}</Typography>
                       </Box>
                     </Stack>
                   </Grid>
                   
                   {/* Campo a larghezza completa sotto le colonne */}
                   <Grid item xs={12}>
                     <Box sx={{ 
                       p: 2, 
                       borderRadius: 2, 
                       border: '1px solid #e0e0e0',
                       backgroundColor: '#f8f9fa'
                     }}>
                       <Typography variant="subtitle2" fontWeight="bold">Descrizione match:</Typography>
                       <Typography>{selectedGiocatore?.descrizione_match || '-'}</Typography>
                     </Box>
                   </Grid>
                 </Grid>
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
                 <Button type="button" color="primary" onClick={handlePassaAVisionato}>Passa a Visionato</Button>
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

        {/* Dialog per aggiungere nuovo giocatore */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Segnala nuovo giocatore</DialogTitle>
          <DialogContent>
            <form id="segnala-form" onSubmit={handleSubmit}>
              <Stack spacing={2} mt={1}>
                <TextField label="Nome" name="nome" value={form.nome} onChange={handleChange} />
                <TextField label="Cognome" name="cognome" value={form.cognome} onChange={handleChange} />
                <TextField label="Squadra" name="squadra" value={form.squadra} onChange={handleChange} required />
                <TextField label="Anno di nascita" name="anno_nascita" value={form.anno_nascita} onChange={handleChange} required type="number" />
                <TextField label="Numero maglia" name="numero_maglia" value={form.numero_maglia} onChange={handleChange} required type="number" />
                <TextField label="Struttura fisica" name="struttura_fisica" value={form.struttura_fisica} onChange={handleChange} />
                <TextField select label="Piede" name="piede" value={form.piede} onChange={handleChange} >
                  <MenuItem value="">-</MenuItem>
                  {PIEDI.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </TextField>
                <TextField label="Capacità fisica" name="capacita_fisica" value={form.capacita_fisica} onChange={handleChange} />
                <TextField label="Capacità cognitiva" name="capacita_cognitiva" value={form.capacita_cognitiva} onChange={handleChange} />
                <TextField select label="Ruolo" name="ruolo" value={form.ruolo} onChange={handleChange} required>
                  <MenuItem value="">-</MenuItem>
                  {RUOLI.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                </TextField>
                <TextField label="Descrizione match" name="descrizione_match" value={form.descrizione_match} onChange={handleChange} />
                <TextField
                  label="Giorno in cui l'hai visto"
                  name="data_segnalazione"
                  type="date"
                  value={form.data_segnalazione}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
              </Stack>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annulla</Button>
            <Button type="submit" form="segnala-form" variant="contained">Salva</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}

export default Segnalati; 