// users.js
import axios from "axios";

const API_URL = "https://api-restaurante-h08h.onrender.com/"; // Cambia si tu backend está en otra URL

// Obtener todos los usuarios
export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users/`);
  return response.data;
};

// Crear usuario
export const createUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users/`, userData);
  return response.data;
};

// Actualizar usuario
export const updateUser = async (id, userData) => {
  const response = await axios.put(`${API_URL}/users/${id}`, userData);
  return response.data;
};

// Eliminar (lógico) usuario
export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/users/${id}`);
  return response.data;
};
