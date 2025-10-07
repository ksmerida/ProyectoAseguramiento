import axios from "axios";

const API_URL = "https://api-restaurante-h08h.onrender.com/";

// Obtener todos los inventarios
export const getInventory = async () => {
  const response = await axios.get(`${API_URL}/inventory`);
  return response.data;
};

// Crear inventario
export const createInventory = async (data) => {
  const response = await axios.post(`${API_URL}/inventory`, data);
  return response.data;
};

// Actualizar inventario
export const updateInventory = async (id, data) => {
  const response = await axios.put(`${API_URL}/inventory/${id}`, data);
  return response.data;
};

// Eliminar (lógico)
export const deleteInventory = async (id) => {
  const response = await axios.delete(`${API_URL}/inventory/${id}`);
  return response.data;
};
