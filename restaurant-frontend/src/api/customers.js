// customers.js
import axios from "axios";

const API_URL = "https://api-restaurante-h08h.onrender.com"; // Cambia si tu backend está en otra URL

// Obtener todos los clientes
export const getCustomers = async () => {
  const response = await axios.get(`${API_URL}/customers/`);
  return response.data;
};

// Crear cliente
export const createCustomer = async (customerData) => {
  const response = await axios.post(`${API_URL}/customers/`, customerData);
  return response.data;
};

// Actualizar cliente
export const updateCustomer = async (id, customerData) => {
  const response = await axios.put(`${API_URL}/customers/${id}`, customerData);
  return response.data;
};

// Eliminar cliente (lógico)
export const deleteCustomer = async (id) => {
  const response = await axios.delete(`${API_URL}/customers/${id}`);
  return response.data;
};
