// frontend/scouting-frontend/src/utils/auth.js
import axios from "axios";

// Prende la base URL dalle env di CRA (impostata su Railway)
// es: REACT_APP_API_BASE_URL=https://scoutingapp-production.up.railway.app
const API_ROOT = process.env.REACT_APP_API_BASE_URL || "https://scoutingapp-production.up.railway.app";
const API_BASE_URL = `${API_ROOT.replace(/\/$/, "")}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // resta false se usi JWT
});

// ---- Token helpers (localStorage) ----
export const getAccessToken = () => localStorage.getItem("access_token");
export const getRefreshToken = () => localStorage.getItem("refresh_token");
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const setTokens = (accessToken, refreshToken, user) => {
  localStorage.setItem("access_token", accessToken);
  if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
  if (user) localStorage.setItem("user", JSON.stringify(user));
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  delete api.defaults.headers.common["Authorization"];
};

export const isAuthenticated = () => !!getAccessToken();

// ---- Refresh token con SimpleJWT ----
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available");

  const { data } = await api.post("/token/refresh/", { refresh: refreshToken });
  const newAccessToken = data.access;
  localStorage.setItem("access_token", newAccessToken);
  api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
  return newAccessToken;
};

// Interceptor: se 401 prova il refresh una volta e ritenta
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await refreshAccessToken();
        return api(original);
      } catch (e) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

// Carica l’Authorization se già loggato
const existing = getAccessToken();
if (existing) api.defaults.headers.common["Authorization"] = `Bearer ${existing}`;

export default api;
