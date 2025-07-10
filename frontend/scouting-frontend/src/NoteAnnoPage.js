import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, TextField, Stack, Paper, IconButton, InputAdornment, MenuItem, CircularProgress, Alert } from '@mui/material';
import { Search, Delete, CloudDownload, UploadFile } from '@mui/icons-material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import axios from './utils/auth';

const ORDER_OPTIONS = [
  { value: '-data_caricamento', label: 'Più recenti' },
  { value: 'data_caricamento', label: 'Meno recenti' },
  { value: 'nome', label: 'Nome A-Z' },
  { value: '-nome', label: 'Nome Z-A' },
];

function NoteAnnoPage() {
  const { anno } = useParams();
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('-data_caricamento');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { anno, ordering: order };
      if (search) params.search = search;
      const res = await axios.get('http://127.0.0.1:8000/api/note/', { params });
      setFiles(res.data);
    } catch (err) {
      setError('Errore nel caricamento dei file');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [anno, order, search]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleFileChange = e => {
    const f = e.target.files[0];
    if (f && f.size > 2 * 1024 * 1024) {
      setError('Il file supera i 2MB!');
      return;
    }
    setFile(f);
  };

  const handleUpload = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('anno', anno);
      formData.append('file', file);
      formData.append('nome', file.name);
      await axios.post('http://127.0.0.1:8000/api/note/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('File caricato con successo!');
      setFile(null);
      fetchFiles();
    } catch (err) {
      setError('Errore nel caricamento del file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Vuoi eliminare questo file?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/note/${id}/`);
      fetchFiles();
    } catch (err) {
      setError('Errore nell\'eliminazione del file');
    }
  };

  return (
    <Box sx={{ background: 'transparent', minHeight: '100vh', p: { xs: 1, sm: 2 } }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/notereferti')} sx={{ mb: 2, bgcolor: '#fff', color: 'primary.main', fontWeight: 600 }}>
        Indietro
      </Button>
      <Typography variant="h4" fontWeight={700} mb={2} color="primary">
        Note e Referti {anno}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3} alignItems="center">
        <TextField
          label="Cerca per nome"
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            style: { background: '#fff', color: '#004080', fontWeight: 600 },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={fetchFiles} sx={{ color: 'primary.main', bgcolor: '#fff !important' }}><Search /></IconButton>
              </InputAdornment>
            )
          }}
          sx={{ background: '#fff', color: 'primary.main', borderRadius: 1 }}
        />
        <TextField
          select
          label="Ordina per"
          value={order}
          onChange={e => setOrder(e.target.value)}
          sx={{ minWidth: 180, background: '#fff', color: 'primary.main', borderRadius: 1 }}
          InputProps={{ style: { color: '#004080', fontWeight: 600 } }}
        >
          {ORDER_OPTIONS.map(opt => (
            <MenuItem key={opt.value} value={opt.value} sx={{ color: 'primary.main' }}>{opt.label}</MenuItem>
          ))}
        </TextField>
        <form onSubmit={handleUpload} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button variant="contained" component="label" startIcon={<UploadFile />} disabled={uploading} sx={{ bgcolor: '#fff', color: 'primary.main', fontWeight: 600, border: '1px solid #004080', '&:hover': { bgcolor: '#f0f4fa' } }}>
            Carica PDF
            <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={!file || uploading} sx={{ bgcolor: '#fff', color: 'primary.main', fontWeight: 600, border: '1px solid #004080', '&:hover': { bgcolor: '#f0f4fa' } }}>
            {uploading ? <CircularProgress size={20} /> : 'Upload'}
          </Button>
          {file && <Typography variant="body2" color="#004080">{file.name}</Typography>}
        </form>
      </Stack>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {loading ? (
        <Box textAlign="center" mt={4}><CircularProgress /></Box>
      ) : (
        <Paper sx={{ p: 2, background: '#fff', color: 'primary.main' }}>
          {files.length === 0 ? (
            <Typography>Nessun file caricato per il {anno}.</Typography>
          ) : (
            <Stack spacing={2}>
              {files.map(f => (
                <Box key={f.id} display="flex" alignItems="center" justifyContent="space-between" sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>{f.nome}</Typography>
                    <Typography variant="body2" color="text.secondary">Caricato il {new Date(f.data_caricamento).toLocaleString()}</Typography>
                  </Box>
                  <Box>
                    <IconButton href={f.file} target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main', bgcolor: '#fff !important' }}><CloudDownload /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(f.id)} sx={{ bgcolor: '#fff !important' }}><Delete /></IconButton>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default NoteAnnoPage; 