// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import api, { setTokens, getUser } from "./utils/auth";
import logoFloria from './assets/logo_floria.png';
import abstractBackground from './assets/abstract-blue-bg.png';

export default function LoginPage({ onLoginSuccess }) {
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
        const { data } = await api.post("/token/", { username, password });
        setTokens(data.access, data.refresh);

        const user = getUser?.();          // se avevi salvato lo user altrove
        onLoginSuccess?.(user);             // opzionale
        navigate("/home", { replace: true });
      } catch (err) {
        console.error("Errore login:", err);
        const msg =
          err.response?.data?.detail ||
          err.response?.data?.error ||
          "Credenziali non valide o errore di connessione";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };



  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url(${abstractBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 6,
          width: 500,
          maxWidth: '90%',
          borderRadius: 4,
          bgcolor: '#ffffff',        // stesso colore di sfondo del logo
          textAlign: 'center'
        }}
      >
        <Box mb={3}>
          <img
            src={logoFloria}
            alt="Logo Floria"
            style={{ width: 120, marginBottom: 16 }}
          />
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 700, color: '#ffffff' }}
          >
            Floria Scouting Manager
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
            Accedi al tuo account
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            margin="dense"
            required
            disabled={loading}
            sx={{
              mb: 2,
              bgcolor: '#ffffff',
              borderRadius: 1
            }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="dense"
            required
            disabled={loading}
            sx={{
              mb: 2,
              bgcolor: '#ffffff',
              borderRadius: 1
            }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<LoginIcon />}
            fullWidth
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.5,
              fontSize: '1.2rem',
              fontWeight: 700,
              bgcolor: 'secondary.main',
              '&:hover': { bgcolor: 'secondary.dark' }
            }}
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
