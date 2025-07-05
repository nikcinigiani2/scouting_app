import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, Paper } from '@mui/material';
import { setTokens } from './utils/auth';
import axios from './utils/auth';

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
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" mb={2}>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled={loading}
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
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2 }}
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