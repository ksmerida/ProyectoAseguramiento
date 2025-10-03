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

// Estados de mesas
export const getTableStatus = async () => {
  const response = await axios.get(`${API_URL}/table_status`);
  return response.data;
};

export const updateTableStatus = async (id, statusData) => {
  const response = await axios.put(`${API_URL}/table_status/${id}`, statusData);
  return response.data;
};
