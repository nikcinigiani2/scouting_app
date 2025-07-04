import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, List, ListItem, ListItemText, Paper, Alert } from '@mui/material';
import axios from './utils/auth';

function Visionati() {
  const [search, setSearch] = useState('');
  const [visionati, setVisionati] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchVisionati = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://127.0.0.1:8001/api/visionati/');
      setVisionati(res.data);
    } catch (err) {
      console.error('Errore nel recupero dei visionati:', err);
      setError('Errore nel recupero dei visionati');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVisionati(); }, []);

  const filtered = visionati.filter(g =>
    (g.nome + ' ' + g.cognome + ' ' + g.squadra + ' ' + g.anno_nascita).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>Giocatori Visionati</Typography>
        <TextField
          label="Cerca giocatore"
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth
          margin="normal"
        />
        {loading && <Typography sx={{ mt: 2 }}>Caricamento...</Typography>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <List>
          {filtered.map(g => (
            <ListItem key={g.id} button>
              <ListItemText
                primary={`${g.nome || ''} ${g.cognome || ''} (${g.squadra}, ${g.anno_nascita})`}
                secondary={`ID: ${g.id}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default Visionati; 