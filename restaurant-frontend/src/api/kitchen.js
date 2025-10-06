// src/api/kitchen.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // Cambiar según tu backend

// Obtener órdenes relevantes para cocina
export const getKitchenOrders = async () => {
  const res = await axios.get(`${API_URL}/kitchen/orders`);
  return res.data;
};

// Obtener detalles de una orden (incluye items)
export const getKitchenOrder = async (orderId) => {
  const res = await axios.get(`${API_URL}/kitchen/orders/${orderId}`);
  return res.data;
};

// Actualizar estado de una orden (p. ej., "preparing", "ready", "served")
export const updateKitchenOrderStatus = async (orderId, status) => {
  const res = await axios.put(`${API_URL}/kitchen/orders/${orderId}/status`, null, {
    params: { status } // enviamos el estado como query param
  });
  return res.data;
};
