// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import Segnalati from './Segnalati';
import Visionati from './Visionati';
import Ricerca from './Ricerca';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated, clearTokens, getUser } from './utils/auth';
import theme from './theme';
import './theme.css';
import logoFloria from './assets/logo_floria.png';

function DettaglioGiocatore() { return <div>Dettaglio Giocatore</div>; }

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Controlla se l'utente è autenticato all'avvio
    if (isAuthenticated()) {
      setUser(getUser());
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    clearTokens();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static" sx={{ bgcolor: 'primary.main', boxShadow: 2 }}>
          <Toolbar sx={{ minHeight: 64, px: 0, width: '100%', maxWidth: '100vw', justifyContent: 'space-between' }}>
            <Box display="flex" alignItems="center" sx={{ height: 48 }}>
              <img src={logoFloria} alt="Logo Floria" style={{ height: 40, marginRight: 16, marginLeft: 8 }} />
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1, color: 'white' }}>
                Floria Scouting Manager
              </Typography>
            </Box>
            {user ? (
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" sx={{ mr: 2, color: 'white' }}>
                  Benvenuto, {user.first_name || user.username}!
                </Typography>
                <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
                <Button color="inherit" component={Link} to="/segnalati">Segnalati</Button>
                <Button color="inherit" component={Link} to="/visionati">Visionati</Button>
                <Button color="inherit" component={Link} to="/ricerca">Ricerca</Button>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </Box>
            ) : (
              <Button color="inherit" component={Link} to="/login">Login</Button>
            )}
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2 }}>
          <Routes>
            <Route path="/login" element={
              isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/segnalati" element={
              <ProtectedRoute>
                <Segnalati />
              </ProtectedRoute>
            } />
            <Route path="/visionati" element={
              <ProtectedRoute>
                <Visionati />
              </ProtectedRoute>
            } />
            <Route path="/ricerca" element={
              <ProtectedRoute>
                <Ricerca />
              </ProtectedRoute>
            } />
            <Route path="/giocatore/:id" element={
              <ProtectedRoute>
                <DettaglioGiocatore />
              </ProtectedRoute>
            } />
            <Route path="/" element={
              isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;

