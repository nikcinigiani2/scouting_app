// src/NoteAnnoPage.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Stack,
  Paper,
  IconButton,
  InputAdornment,
  MenuItem,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Search,
  Delete,
  CloudDownload,
  UploadFile,
  InsertDriveFile
} from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import axios from './utils/auth';
import logoFloria from './assets/logo_floria.png';
import abstractBackground from './assets/abstract-blue-bg.png';
import { clearTokens } from './utils/auth';

const ORDER_OPTIONS = [
  { value: '-data_caricamento', label: 'Più recenti' },
  { value: 'data_caricamento', label: 'Meno recenti' },
  { value: 'nome', label: 'Nome A-Z' },
  { value: '-nome', label: 'Nome Z-A' },
];

export default function NoteAnnoPage() {
  const { anno } = useParams();
  const nav = useNavigate();
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('-data_caricamento');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { anno, ordering: order };
      if (search) params.search = search;
      const res = await axios.get('http://127.0.0.1:8000/api/note/', { params });
      setFiles(res.data);
    } catch {
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

  const handleBack = () => nav(-1);
  const handleLogout = () => {
    clearTokens();
    nav('/login', { replace: true });
  };

  const handleFileChange = e => {
    const f = e.target.files[0];
    if (f && f.size > 5 * 1024 * 1024) {
      setError('Il file supera il limite di 5 MB');
      setFile(null);
    } else {
      setError(null);
      setFile(f);
    }
  };

  const handleUpload = async e => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError(null);
    setSuccess(null);
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
    } catch {
      setError('Errore nel caricamento del file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Vuoi eliminare questo file?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/note/${id}/`);
      fetchFiles();
    } catch {
      setError("Errore nell'eliminazione del file");
    }
  };

  const handleDownload = fileUrl => {
    const url = fileUrl.startsWith('http') ? fileUrl : `${window.location.origin}${fileUrl}`;
    window.open(url, '_blank');
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
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Navbar */}
      <AppBar position="absolute" color="transparent" elevation={0}
        sx={{ bgcolor: 'rgba(255,255,255,0.9)', zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar disableGutters sx={{ px: 2, height: 64, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src={logoFloria} alt="Floria" style={{ height: 40 }} />
            <Typography variant="h6" sx={{ color: '#1565c0', fontWeight: 700 }}>
              Floria Scouting Manager
            </Typography>
          </Box>
          <Button onClick={handleLogout} variant="outlined"
            sx={{
              borderColor: '#1565c0',
              color: '#1565c0',
              borderRadius: 2,
              textTransform: 'none',
              px: 2,
              '&:hover': { backgroundColor: 'rgba(21,101,192,0.08)' }
            }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Back button */}
      <Box sx={{ pt: 12, px: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
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

      {/* Content */}
      <Box sx={{ flexGrow: 1, pt: 2, px: { xs: 2, sm: 4 }, pb: 4, overflowY: 'auto' }}>
        <Typography variant="h5" sx={{ color: '#fff!important', fontWeight: 700, mb: 2 }}>
          Note e Referti {anno}
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3} alignItems="center">
          <TextField
            label="Cerca per nome"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={fetchFiles} sx={{ color: 'primary.main', bgcolor: '#fff !important' }}>
                    <Search />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              background: '#fff',
              borderRadius: 1,
              flexGrow: 1,
              '& .MuiInputBase-input': { color: '#1565c0', fontWeight: 600 }
            }}
          />
          <TextField
            select
            label="Ordina per"
            value={order}
            onChange={e => setOrder(e.target.value)}
            variant="filled"
            sx={{
              width: 220,
              background: '#fff',
              borderRadius: 1,
              '& .MuiInputLabel-root': {
                color: '#1565c0',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'visible'
              },
              '& .MuiSelect-select': {
                color: '#1565c0',
                fontWeight: 500,
                pt: '24px'
              }
            }}
          >
            {ORDER_OPTIONS.map(opt => (
              <MenuItem key={opt.value} value={opt.value} sx={{ color: 'primary.main' }}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {loading ? (
          <Box textAlign="center" mt={4}><CircularProgress /></Box>
        ) : (
          <>
            <Paper sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.85)', borderRadius: 2 }}>
              <List>
                {files.length === 0 ? (
                  <ListItem><ListItemText primary="Nessun file caricato" /></ListItem>
                ) : files.map(f => (
                  <ListItem
                    key={f.id}
                    secondaryAction={
                      <Box>
                        <IconButton onClick={() => handleDownload(f.file)}
                          sx={{ color: 'primary.main', bgcolor: '#fff !important', mr: 1 }}>
                          <CloudDownload />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(f.id)}
                          sx={{ bgcolor: '#fff !important' }}>
                          <Delete />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemIcon><InsertDriveFile sx={{ color: 'primary.main' }} /></ListItemIcon>
                    <ListItemText
                      primary={f.nome}
                      secondary={new Date(f.data_caricamento).toLocaleString()}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Upload box */}
            <Paper
              component="form"
              onSubmit={handleUpload}
              sx={{
                p: 2,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'rgba(255,255,255,0.95)',
                gap: 2
              }}
            >
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadFile />}
                disabled={uploading}
                sx={{
                  bgcolor: 'secondary.main',
                  color: '#fff',
                  fontWeight: 600,
                  '&:hover': { bgcolor: 'secondary.dark' }
                }}
              >
                Scegli il PDF
                <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
              </Button>
              <Typography variant="body2" sx={{ color: '#1565c0', fontWeight: 600, flexGrow: 1, textAlign: 'center' }}>
                {file ? file.name : ''}
              </Typography>
              <Button
                type="submit"
                variant="contained"
                disabled={!file || uploading}
                sx={{
                  bgcolor: 'secondary.main',
                  color: '#fff',
                  fontWeight: 600,
                  '&:hover': { bgcolor: 'secondary.dark' }
                }}
              >
                {uploading ? <CircularProgress size={20} color="inherit" /> : 'Upload'}
              </Button>
            </Paper>
          </>
        )}
      </Box>
    </Box>
  );
}
