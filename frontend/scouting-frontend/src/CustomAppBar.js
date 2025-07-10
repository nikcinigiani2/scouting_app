import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography, IconButton } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ArrowBack from '@mui/icons-material/ArrowBack';
import logoFloria from './assets/logo_floria.png';

function CustomAppBar({ user, handleLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Determina se mostrare il tasto indietro e dove porta
  let showBack = false;
  let backTo = '/home';
  if (location.pathname.startsWith('/notereferti/')) {
    showBack = true;
    backTo = '/notereferti';
  } else if (
    location.pathname.startsWith('/notereferti') && location.pathname !== '/notereferti'
  ) {
    showBack = false;
  } else if (
    ['/dashboard', '/segnalati', '/visionati', '/ricerca'].includes(location.pathname)
  ) {
    showBack = true;
    backTo = '/home';
  }

  return (
    <AppBar position="static" sx={{ bgcolor: '#fff !important', backgroundColor: '#fff !important', color: '#004080 !important', boxShadow: 2, borderBottom: '2px solid #e0e0e0' }}>
      <Toolbar sx={{ minHeight: 64, px: 0, width: '100%', maxWidth: '100vw', justifyContent: 'space-between', bgcolor: '#fff !important', backgroundColor: '#fff !important' }}>
        <Box display="flex" alignItems="center" sx={{ height: 48, bgcolor: '#fff !important', backgroundColor: '#fff !important' }}>
          {showBack && (
            <IconButton onClick={() => navigate(backTo)} sx={{ mr: 1, bgcolor: '#fff', color: 'primary.main' }}>
              <ArrowBack />
            </IconButton>
          )}
          <img src={logoFloria} alt="Logo Floria" style={{ height: 40, marginRight: 16, marginLeft: 8 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1, color: '#004080' }}>
            Floria Scouting Manager
          </Typography>
        </Box>
        {user ? (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" sx={{ mr: 2, color: '#004080' }}>
              Benvenuto, {user.first_name || user.username}!
            </Typography>
            <Button variant="text" color="primary" component={Link} to="/home">Home</Button>
            {location.pathname !== '/notereferti' && (
              <Button variant="text" color="primary" component={Link} to="/dashboard">Dashboard</Button>
            )}
            <Button variant="text" color="primary" onClick={handleLogout}>Logout</Button>
          </Box>
        ) : (
          <Button color="primary" component={Link} to="/login">Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default CustomAppBar; 