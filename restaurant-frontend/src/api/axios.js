// src/api/axiosConfig.js
import axios from "axios";

const API_URL = "https://proyectoaseguramiento-production.up.railway.app";

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para enviar siempre el token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
