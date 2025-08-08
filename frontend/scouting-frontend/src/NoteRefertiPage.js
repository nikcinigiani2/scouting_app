// src/NoteRefertiPage.js
import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Paper
} from '@mui/material';
import { ArrowBack, Folder } from '@mui/icons-material';
import {Link, useNavigate} from 'react-router-dom';
import logoFloria from './assets/logo_floria.png';
import abstractBackground from './assets/abstract-blue-bg.png';
import { clearTokens } from './utils/auth';

const ANNI = [2010, 2011, 2012, 2013, 2014, 2015, 2016];

export default function NoteRefertiPage() {
  const nav = useNavigate();

  const handleBack = () => nav(-1);
  const handleLogout = () => {
    clearTokens();
    nav('/login', { replace: true });
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
        flexDirection: 'column',
      }}
    >
      {/* Navbar */}
      <AppBar
        position="absolute"
        color="transparent"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255,255,255,0.9)',
          zIndex: theme => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar disableGutters sx={{ px: 2, height: 64, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src={logoFloria} alt="Floria" style={{ height: 40 }} />
            <Typography variant="h6" sx={{ color: '#1565c0', fontWeight: 700 }}>
              Floria Scouting Manager
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              component="button"
              onClick={() => nav('/dashboard')}
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

      {/* Back button */}
      <Box sx={{ pt: 12, px: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          //onClick={handleBack}
          component={Link}
            to="/home"
            variant="outlined"
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

      {/* Lista annate */}
      <Box
        sx={{
          flexGrow: 1,
          px: { xs: 2, sm: 4 },
          py: 2,
          overflowY: 'auto'
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#fff !important',
            fontWeight: 700,
            mb: 1,
            textAlign: 'center'
          }}
        >
          Note e Referti
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255,255,255,0.85)',
            mb: 3,
            textAlign: 'center'
          }}
        >
          Seleziona l’annata:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {ANNI.map(anno => (
            <Paper
              key={anno}
              elevation={4}
              onClick={() => nav(`/notereferti/${anno}`)}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.85)',
                cursor: 'pointer'
              }}
            >
              <Folder sx={{ fontSize: 40, color: '#1565c0' }} />
              <Typography variant="h6" sx={{ color: '#1565c0', fontWeight: 600 }}>
                {anno}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
