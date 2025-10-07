// menuCategories.js
import axios from "axios";

const API_URL = "https://api-restaurante-h08h.onrender.com"; // Cambia si tu backend está en otra URL

// Obtener todas las categorías de menú
export const getMenuCategories = async () => {
  const response = await axios.get(`${API_URL}/menu_categories/`);
  return response.data;
};

// Crear categoría de menú
export const createMenuCategory = async (categoryData) => {
  const response = await axios.post(`${API_URL}/menu_categories/`, categoryData);
  return response.data;
};

// Actualizar categoría de menú
export const updateMenuCategory = async (id, categoryData) => {
  const response = await axios.put(`${API_URL}/menu_categories/${id}`, categoryData);
  return response.data;
};

// Eliminar categoría de menú (lógico)
export const deleteMenuCategory = async (id) => {
  const response = await axios.delete(`${API_URL}/menu_categories/${id}`);
  return response.data;
};
