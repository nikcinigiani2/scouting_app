// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
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
import HomePage from './HomePage';
import NoteRefertiPage from './NoteRefertiPage';
import CustomAppBar from './CustomAppBar';
import NoteAnnoPage from './NoteAnnoPage';

function DettaglioGiocatore() { return <div>Dettaglio Giocatore</div>; }

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

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
      <CustomAppBar user={user} handleLogout={handleLogout} />
      <Box sx={{ p: 2 }}>
        <Routes>
            <Route path="/login" element={
              isAuthenticated() ? <Navigate to="/home" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
            } />
            <Route path="/home" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
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
            <Route path="/notereferti" element={
              <ProtectedRoute>
                <NoteRefertiPage />
              </ProtectedRoute>
            } />
            <Route path="/notereferti/:anno" element={
              <ProtectedRoute>
                <NoteAnnoPage />
              </ProtectedRoute>
            } />
            <Route path="/giocatore/:id" element={
              <ProtectedRoute>
                <DettaglioGiocatore />
              </ProtectedRoute>
            } />
            <Route path="/" element={
              isAuthenticated() ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
            } />
          </Routes>
        </Box>
    </ThemeProvider>
  );
}

export default App;

