import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    // Reindirizza al login se l'utente non è autenticato
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute; 