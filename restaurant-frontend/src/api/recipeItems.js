import axios from "axios";

const API_URL = "https://api-restaurante-h08h.onrender.com/";

// Obtener todos los recipe items
export const getRecipeItems = async () => {
  const response = await axios.get(`${API_URL}/recipe_items`);
  return response.data;
};

// Crear recipe item
export const createRecipeItem = async (data) => {
  const response = await axios.post(`${API_URL}/recipe_items`, data);
  return response.data;
};

// Actualizar recipe item
export const updateRecipeItem = async (id, data) => {
  const response = await axios.put(`${API_URL}/recipe_items/${id}`, data);
  return response.data;
};

// Eliminar (lógico)
export const deleteRecipeItem = async (id) => {
  const response = await axios.delete(`${API_URL}/recipe_items/${id}`);
  return response.data;
};

// Obtener menú y inventory para selects
export const getMenuItems = async () => {
  const response = await axios.get(`${API_URL}/menu_items`);
  return response.data.filter(item => item.is_active);
};

export const getInventory = async () => {
  const response = await axios.get(`${API_URL}/inventory`);
  return response.data.filter(item => item.is_active);
};
