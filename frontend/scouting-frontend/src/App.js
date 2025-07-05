// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import Segnalati from './Segnalati';
import Visionati from './Visionati';
import Ricerca from './Ricerca';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated, clearTokens, getUser } from './utils/auth';
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
    <Router>
      <AppBar position="static" sx={{ bgcolor: '#1565c0' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Scouting Calcio</Typography>
          {user ? (
            <>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Benvenuto, {user.first_name || user.username}!
              </Typography>
              <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
              <Button color="inherit" component={Link} to="/segnalati">Segnalati</Button>
              <Button color="inherit" component={Link} to="/visionati">Visionati</Button>
              <Button color="inherit" component={Link} to="/ricerca">Ricerca</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
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
  );
}

export default App;

