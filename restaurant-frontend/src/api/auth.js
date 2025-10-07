// src/api/auth.js
import axios from "axios";
import qs from "qs";

const API_URL = "https://api-restaurante-h08h.onrender.com/";

export const login = async ({ username, password }) => {
  const response = await axios.post(
    `${API_URL}/auth/login`,
    qs.stringify({ username, password }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return response.data;
};

// Obtener datos del usuario logueado
export const getMe = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
