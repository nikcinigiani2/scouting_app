import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const ANNI = [2010, 2011, 2012, 2013, 2014, 2015, 2016];

function NoteRefertiPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedAnno, setSelectedAnno] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleOpen = (anno) => {
    navigate(`/notereferti/${anno}`);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAnno(null);
    setFile(null);
    setError('');
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && f.size > 2 * 1024 * 1024) {
      setError('Il file supera i 2MB!');
      setFile(null);
    } else {
      setError('');
      setFile(f);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Seleziona un file');
      return;
    }
    // Qui andrà la chiamata API per l'upload
    alert(`File per annata ${selectedAnno} pronto per upload (mock)`);
    handleClose();
  };

  return (
    <Box sx={{ background: 'transparent', minHeight: '100vh', p: { xs: 1, sm: 2 } }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/home')} sx={{ mb: 2, bgcolor: '#fff', color: 'primary.main', fontWeight: 600 }}>
        Indietro
      </Button>
      <Typography variant="h4" fontWeight={700} mb={4} color="primary">
        Note e Referti
      </Typography>
      <Typography variant="body1" mb={3} color="primary.main">
        Seleziona una cartella per caricare o consultare i file relativi all'annata:
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {ANNI.map(anno => (
          <Paper key={anno} elevation={3} sx={{ p: 3, textAlign: 'left', cursor: 'pointer', borderRadius: 2, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', background: '#fff', color: 'primary.main' }} onClick={() => handleOpen(anno)}>
            <FolderIcon sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
            <Typography variant="h6" mt={1}>{anno}</Typography>
          </Paper>
        ))}
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Carica file per annata {selectedAnno}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleUpload}>
            <Button variant="contained" component="label" sx={{ mb: 2 }}>
              Scegli file
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {file && <Typography variant="body2">File selezionato: {file.name}</Typography>}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annulla</Button>
          <Button onClick={handleUpload} variant="contained" color="primary" disabled={!file || !!error}>Carica</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default NoteRefertiPage; 