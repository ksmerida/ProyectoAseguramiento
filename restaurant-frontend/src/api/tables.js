import axios from "axios";

const API_URL = "http://localhost:8000";

// Mesas
export const getTables = async () => {
  const response = await axios.get(`${API_URL}/tables`);
  return response.data;
};

export const createTable = async (tableData) => {
  const response = await axios.post(`${API_URL}/tables`, tableData);
  return response.data;
};

// Actualizar estado de mesa
export const updateTableStatus = async (id, statusData) => {
  // PATCH al endpoint correcto con solo { status }
  const response = await axios.patch(`${API_URL}/tables/${id}/status`, statusData);
  return response.data;
};

// Eliminar mesa
export const deleteTable = async (id) => {
  const response = await axios.delete(`${API_URL}/tables/${id}`);
  return response.data;
};
