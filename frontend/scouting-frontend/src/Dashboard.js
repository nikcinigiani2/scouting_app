// src/Dashboard.js
import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Paper
} from '@mui/material';
import {
  PersonAdd,
  Visibility,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import logoFloria from './assets/logo_floria.png';
import abstractBackground from './assets/abstract-blue-bg.png';
import { clearTokens } from './utils/auth';

export default function Dashboard() {
  const nav = useNavigate();

  const handleLogout = () => {
    clearTokens();
    nav('/login', { replace: true });
  };

  const handleBack = () => {
    nav(-1);
  };

  const cards = [
    {
      icon: <PersonAdd sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />,
      title: 'Giocatori Segnalati',
      text: 'Aggiungi e gestisci i giocatori segnalati durante i match.',
      to: '/segnalati',
      buttonText: 'Vai a Segnalati',
      buttonIcon: <PersonAdd />,
      variant: 'contained',
      btnColor: 'secondary.main',
      txtColor: '#fff'
    },
    {
      icon: <Visibility sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />,
      title: 'Giocatori Visionati',
      text: 'Visualizza e modifica i giocatori già visionati.',
      to: '/visionati',
      buttonText: 'Vai a Visionati',
      buttonIcon: <Visibility />,
      variant: 'contained',
      btnColor: 'secondary.main',
      txtColor: '#fff'
    },
    {
      icon: <SearchIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />,
      title: 'Ricerca Giocatori',
      text: 'Cerca tra tutti i giocatori con filtri avanzati.',
      to: '/ricerca',
      buttonText: 'Ricerca',
      buttonIcon: <SearchIcon />,
      variant: 'outlined',
      btnColor: '#fff',
      txtColor: '#1565c0'
    }
  ];

  return (
    <Box
      component="main"
      sx={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url(${abstractBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Navbar */}
      <AppBar
        position="absolute"
        color="transparent"
        elevation={0}
        sx={{ bgcolor: 'rgba(255,255,255,0.9)', zIndex: theme => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ px: 2, height: 64, justifyContent: 'space-between' }}>
          <Box component={Link} to="/home" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src={logoFloria} alt="Floria" style={{ height: 40, marginRight: 8 }} />
            <Typography variant="h6" sx={{ color: '#1565c0', fontWeight: 700 }}>
              Floria Scouting
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button component={Link} to="/notereferti" variant="text" sx={{ color: '#1565c0', textTransform: 'none' }}>
              Note & Referti
            </Button>
            <Button component={Link} to="/dashboard" variant="text" sx={{ color: '#1565c0', textTransform: 'none' }}>
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
      <Box sx={{ pt: 10, px: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          //onClick={handleBack}
            //vorrei che onClick tornasse alla home page
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

      {/* Section title */}
      <Typography
        variant="h3"
        sx={{
          color: '#fff !important',
          fontWeight: 700,
          fontSize: '2.5rem',
          textAlign: 'center',
          mt: 3,
          mb: 2
        }}
      >
        Scouting
      </Typography>

      {/* Cards in a single column, wrapped narrower */}
      <Box sx={{ flexGrow: 1, px: { xs: 2, sm: 4 }, pb: 4 }}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 2,
            maxWidth: 1000,
            width: '100%',
            mx: 'auto',
            bgcolor: 'rgba(255,255,255,0.9)'
          }}
        >
          <Grid container direction="column" spacing={3}>
            {cards.map((card, i) => (
              <Grid item key={i} sx={{ width: '100%' }}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    height: 260,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRadius: 10,
                    bgcolor: 'rgba(255,255,255,0.85)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <Box textAlign="center">
                    {card.icon}
                    <Typography variant="h6" sx={{ color: card.txtColor, fontWeight: 600, mb: 2 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                      {card.text}
                    </Typography>
                  </Box>
                  <Button
                    component={Link}
                    to={card.to}
                    variant={card.variant}
                    size="large"
                    startIcon={card.buttonIcon}
                    sx={{
                      alignSelf: 'center',
                      borderRadius: '999px',
                      bgcolor: card.btnColor,
                      color: card.txtColor,
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor:
                          card.variant === 'contained'
                            ? 'secondary.dark'
                            : 'rgba(21,101,192,0.08)'
                      }
                    }}
                  >
                    {card.buttonText}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}
