// src/pages/HomePage.js
import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Stack
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import logoFloria from './assets/logo_floria.png';
import abstractBackground from './assets/abstract-blue-bg.png';
import { clearTokens } from './utils/auth';

export default function HomePage() {
  const nav = useNavigate();
  const location = useLocation();

  // Leggi nome utente dallo storage
  const stored = JSON.parse(localStorage.getItem('user') || '{}');
  const username = stored.first_name || stored.username || 'utente';

  // Logout senza Context
  const handleLogout = () => {
    clearTokens();
    nav('/login', { replace: true });
  };

  // Mostra il bottone “indietro” se in /notereferti
  const showBack = location.pathname.startsWith('/notereferti');
  const backTo = showBack ? '/notereferti' : '/home';

  return (
    <Box
      component="main"
      sx={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url(${abstractBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden'
      }}
    >
      <AppBar
        position="absolute"
        color="transparent"
        elevation={0}
        sx={{
          zIndex: theme => theme.zIndex.drawer + 1,
          bgcolor: 'rgba(255,255,255,0.9)'
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            px: 2,
            height: 64,
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {showBack && (
              <IconButton
                onClick={() => nav(backTo)}
                sx={{ color: '#1565c0', mr: 1 }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <Link
              to="/home"
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none'
              }}
            >
              <img
                src={logoFloria}
                alt="Logo Floria"
                style={{ height: 40, marginRight: 8 }}
              />
              <Typography
                variant="h6"
                sx={{ color: '#1565c0', fontWeight: 700, letterSpacing: 1 }}
              >
                Floria Scouting Manager
              </Typography>
            </Link>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              component={Link}
              to="/notereferti"
              variant="text"
              sx={{ color: '#1565c0', textTransform: 'none' }}
            >
              Note & Referti
            </Button>
            <Button
              component={Link}
              to="/dashboard"
              variant="text"
              sx={{ color: '#1565c0', textTransform: 'none' }}
            >
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

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pt: 8,
          px: 3,
          textAlign: 'center'
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            color: '#fff',
            fontWeight: 700,
            textShadow: '0 2px 8px rgba(0,0,0,0.4)'
          }}
        >
          Benvenuto, {username}
        </Typography>


        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={4}
          justifyContent="center"
        >
          <Button
            onClick={() => nav('/notereferti')}
            variant="contained"
            size="large"
            sx={{
              borderRadius: '999px',
              px: 8,
              py: 3,
              fontSize: '1.125rem',
              fontWeight: 600,
              bgcolor: 'secondary.main',
              boxShadow: 3,
              transition: 'transform 0.2s, boxShadow 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: 6,
                bgcolor: 'secondary.dark'
              }
            }}
          >
            Note & Referti
          </Button>
          <Button
            onClick={() => nav('/dashboard')}
            variant="outlined"
            size="large"
            sx={{
              borderRadius: '999px',
              px: 8,
              py: 3,
              fontSize: '1.125rem',
              fontWeight: 600,
              borderColor: 'rgba(255,255,255,0.85)',
              color: '#fff',
              backdropFilter: 'blur(4px)',
              transition: 'transform 0.2s, backgroundColor 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Scouting Giocatori
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
