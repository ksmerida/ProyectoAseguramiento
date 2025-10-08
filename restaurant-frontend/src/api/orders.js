// orders.js
import axios from "axios";

const API_URL = "https://proyectoaseguramiento-production.up.railway.app"; // Cambiar según tu backend

// Orders
export const getOrders = async () => {
  const res = await axios.get(`${API_URL}/orders`);
  return res.data;
};

export const createOrder = async (orderData) => {
  const res = await axios.post(`${API_URL}/orders`, orderData);
  return res.data;
};

export const updateOrder = async (id, orderData) => {
  const res = await axios.put(`${API_URL}/orders/${id}`, orderData);
  return res.data;
};

export const deleteOrder = async (id) => {
  const res = await axios.delete(`${API_URL}/orders/${id}`);
  return res.data;
};

// Order Items
export const getOrderItems = async (orderId) => {
  const res = await axios.get(`${API_URL}/order_items?order_id=${orderId}`);
  return res.data;
};

export const createOrderItem = async (itemData) => {
  const res = await axios.post(`${API_URL}/order_items`, itemData);
  return res.data;
};

export const updateOrderItem = async (id, itemData) => {
  const res = await axios.put(`${API_URL}/order_items/${id}`, itemData);
  return res.data;
};

export const deleteOrderItem = async (id) => {
  const res = await axios.delete(`${API_URL}/order_items/${id}`);
  return res.data;
};
