// menuItems.js
import axios from "axios";

const API_URL = "https://proyectoaseguramiento-production.up.railway.app";

// Obtener todos los menu items
export const getMenuItems = async () => {
  const response = await axios.get(`${API_URL}/menu_items`);
  return response.data;
};

// Crear menu item
export const createMenuItem = async (data) => {
  const response = await axios.post(`${API_URL}/menu_items`, data);
  return response.data;
};

// Actualizar menu item
export const updateMenuItem = async (id, data) => {
  const response = await axios.put(`${API_URL}/menu_items/${id}`, data);
  return response.data;
};

// Eliminar (lógico)
export const deleteMenuItem = async (id) => {
  const response = await axios.delete(`${API_URL}/menu_items/${id}`);
  return response.data;
};

// Obtener categorías activas para combo box
export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/menu_categories`);
  return response.data.filter(c => c.is_active);
};
