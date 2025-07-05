import axios from 'axios';

// Configurazione base di axios
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Funzione per ottenere il token dal localStorage
export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

// Funzione per salvare i token
export const setTokens = (accessToken, refreshToken, user) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  localStorage.setItem('user', JSON.stringify(user));
  
  // Configura l'header di autorizzazione per tutte le richieste future
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};

// Funzione per rimuovere i token (logout)
export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
};

// Funzione per verificare se l'utente è autenticato
export const isAuthenticated = () => {
  const token = getAccessToken();
  return !!token;
};

// Funzione per ottenere le informazioni dell'utente
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Funzione per rinnovare il token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
      refresh: refreshToken
    });

    const newAccessToken = response.data.access;
    
    // Aggiorna solo l'access token
    localStorage.setItem('access_token', newAccessToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
    
    return newAccessToken;
  } catch (error) {
    console.error('Errore nel refresh del token:', error);
    clearTokens();
    throw error;
  }
};

// Configurazione dell'interceptor per gestire automaticamente il refresh dei token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se l'errore è 401 e non abbiamo già tentato di fare refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshAccessToken();
        // Riprova la richiesta originale con il nuovo token
        return axios(originalRequest);
      } catch (refreshError) {
        // Se il refresh fallisce, reindirizza al login
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Configura l'header di autorizzazione se esiste già un token
const token = getAccessToken();
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axios; 