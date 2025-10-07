// roles.js
import axios from "axios";

const API_URL = "https://api-restaurante-h08h.onrender.com/"; // Cambia si tu backend está en otra URL

// Obtener todos los roles
export const getRoles = async () => {
  const response = await axios.get(`${API_URL}/roles/`);
  return response.data;
};

// Crear rol
export const createRole = async (roleData) => {
  const response = await axios.post(`${API_URL}/roles/`, roleData);
  return response.data;
};

// Actualizar rol
export const updateRole = async (id, roleData) => {
  const response = await axios.put(`${API_URL}/roles/${id}`, roleData);
  return response.data;
};

// Eliminar (lógico) rol
export const deleteRole = async (id) => {
  const response = await axios.delete(`${API_URL}/roles/${id}`);
  return response.data;
};
