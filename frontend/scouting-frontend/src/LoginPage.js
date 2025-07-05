import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, Paper, Avatar } from '@mui/material';
import { Login as LoginIcon, SportsSoccer } from '@mui/icons-material';
import { setTokens } from './utils/auth';
import axios from './utils/auth';
import logoFloria from './assets/logo_floria.png';

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
        username,
        password
      });
      
      // Salva i token usando la funzione di utilità
      setTokens(
        response.data.access_token,
        response.data.refresh_token,
        response.data.user
      );
      
      // Notifica l'App.js che il login è avvenuto con successo
      if (onLoginSuccess) {
        onLoginSuccess(response.data.user);
      }
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Errore login:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Credenziali non valide o errore di connessione');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="80vh"
      sx={{
        background: 'linear-gradient(135deg, #004080 0%, #1565c0 100%)',
        padding: 2
      }}
    >
      <Paper 
        elevation={6} 
        sx={{ 
          p: 4, 
          minWidth: 400,
          maxWidth: 450,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
          border: '1px solid rgba(0, 64, 128, 0.1)'
        }}
      >
        <Box textAlign="center" mb={3}>
          <img src={logoFloria} alt="Logo Floria" style={{ width: 100, marginBottom: 16 }} />
          <Typography variant="h4" mb={1} color="primary" fontWeight="bold">
            Floria Scouting Manager
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Accedi al tuo account
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled={loading}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled={loading}
            sx={{ mb: 2 }}
          />
          {error && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{error}</Alert>}
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            size="large"
            startIcon={<LoginIcon />}
            sx={{ 
              mt: 2,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600
            }}
            disabled={loading}
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default LoginPage; 