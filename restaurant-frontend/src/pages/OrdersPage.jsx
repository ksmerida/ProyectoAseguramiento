import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderItems,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} from "../api/orders";
import axios from "axios";

const apiUrl = "http://localhost:8000";

export default function OrdersPOSPage() {
  const queryClient = useQueryClient();

  // Datos maestros
  const [tables, setTables] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    axios.get(`${apiUrl}/tables`).then(res => setTables(res.data.filter(t => t.is_active)));
    axios.get(`${apiUrl}/customers`).then(res => setCustomers(res.data.filter(c => c.is_active)));
    axios.get(`${apiUrl}/menu_items`).then(res => setMenuItems(res.data.filter(m => m.is_active)));
  }, []);

  // Orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  // Orden seleccionada
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { data: items = [], refetch: refetchItems } = useQuery({
    queryKey: ["orderItems", selectedOrder?.id],
    queryFn: () => getOrderItems(selectedOrder.id),
    enabled: !!selectedOrder,
  });

  // Formulario de orden
  const [orderForm, setOrderForm] = useState({
    tableId: "",
    customerId: "",
    isTakeaway: false,
    status: "pending",
  });

  // Mutaciones
  const orderMutation = useMutation({
    mutationFn: (data) => selectedOrder ? updateOrder(selectedOrder.id, data) : createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setSelectedOrder(null);
      setOrderForm({ tableId: "", customerId: "", isTakeaway: false, status: "pending" });
    },
  });

  const orderDeleteMutation = useMutation({
    mutationFn: (id) => deleteOrder(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const orderItemMutation = useMutation({
    mutationFn: (data) => createOrderItem(data),
    onSuccess: () => refetchItems(),
  });

  const orderItemUpdateMutation = useMutation({
    mutationFn: ({ id, data }) => updateOrderItem(id, data),
    onSuccess: () => refetchItems(),
  });

  const orderItemDeleteMutation = useMutation({
    mutationFn: (id) => deleteOrderItem(id),
    onSuccess: () => refetchItems(),
  });

  // Manejo de formulario
  const handleOrderChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    orderMutation.mutate({
      table_id: orderForm.tableId || null,
      customer_id: orderForm.customerId || null,
      is_takeaway: orderForm.isTakeaway,
      status: orderForm.status,
    });
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setOrderForm({
      tableId: order.table_id || "",
      customerId: order.customer_id || "",
      isTakeaway: order.is_takeaway,
      status: order.status,
    });
  };

  // Items POS
  const [itemForm, setItemForm] = useState({
    menuItemId: "",
    quantity: 1,
    unitPrice: 0,
  });

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItemForm(prev => ({ ...prev, [name]: value }));
  };

  const handleItemSubmit = (e) => {
    e.preventDefault();
    if (!selectedOrder) return alert("Selecciona una orden");
    orderItemMutation.mutate({
      order_id: selectedOrder.id,
      menu_item_id: itemForm.menuItemId,
      quantity: Number(itemForm.quantity),
      unit_price: Number(itemForm.unitPrice),
    });
    setItemForm({ menuItemId: "", quantity: 1, unitPrice: 0 });
  };

  const totalOrder = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);

  if (ordersLoading) return <div>Cargando órdenes...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Órdenes</h1>

      {/* Formulario de Orden */}
      <form onSubmit={handleOrderSubmit} style={{ marginBottom: "20px" }}>
        <select name="tableId" value={orderForm.tableId} onChange={handleOrderChange} style={{ marginRight: "10px" }}>
          <option value="">Mesa</option>
          {tables.map(t => <option key={t.id} value={t.id}>{t.code}</option>)}
        </select>
        <select name="customerId" value={orderForm.customerId} onChange={handleOrderChange} style={{ marginRight: "10px" }}>
          <option value="">Cliente</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label style={{ marginRight: "10px" }}>
          Takeaway
          <input type="checkbox" name="isTakeaway" checked={orderForm.isTakeaway} onChange={handleOrderChange} />
        </label>
        <select name="status" value={orderForm.status} onChange={handleOrderChange} style={{ marginRight: "10px" }}>
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmada</option>
          <option value="cancelled">Cancelada</option>
          <option value="seated">Sentada</option>
          <option value="no_show">No show</option>
        </select>
        <button type="submit">{selectedOrder ? "Actualizar" : "Agregar"}</button>
        {selectedOrder && <button type="button" onClick={() => setSelectedOrder(null)} style={{ marginLeft: "10px" }}>Cancelar</button>}
      </form>

      {/* Tabla de Órdenes */}
      <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>Mesa</th>
            <th>Cliente</th>
            <th>Status</th>
            <th>Takeaway</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => {
            const orderItems = selectedOrder?.id === o.id ? items : [];
            const orderTotal = orderItems.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
            return (
              <tr key={o.id} style={{ backgroundColor: selectedOrder?.id === o.id ? "#eee" : "transparent" }}>
                <td>{tables.find(t => t.id === o.table_id)?.code || "N/A"}</td>
                <td>{customers.find(c => c.id === o.customer_id)?.name || "N/A"}</td>
                <td style={{ color: o.status === "cancelled" ? "red" : o.status === "confirmed" ? "green" : "black" }}>{o.status}</td>
                <td>{o.is_takeaway ? "Sí" : "No"}</td>
                <td>{orderTotal.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleOrderSelect(o)}>Editar</button>
                  <button onClick={() => orderDeleteMutation.mutate(o.id)} style={{ marginLeft: "5px" }}>Eliminar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Items de la Orden */}
      {selectedOrder && (
        <>
          <h2>Items de la Orden (Total: {totalOrder.toFixed(2)})</h2>
          <form onSubmit={handleItemSubmit} style={{ marginBottom: "20px" }}>
            <select name="menuItemId" value={itemForm.menuItemId} onChange={handleItemChange} style={{ marginRight: "10px" }}>
              <option value="">Producto</option>
              {menuItems.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <input type="number" name="quantity" value={itemForm.quantity} min="1" onChange={handleItemChange} style={{ marginRight: "10px" }} />
            <input type="number" name="unitPrice" value={itemForm.unitPrice} min="0" step="0.01" onChange={handleItemChange} style={{ marginRight: "10px" }} />
            <button type="submit">Agregar Item</button>
          </form>

          <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id}>
                  <td>{menuItems.find(m => m.id === i.menu_item_id)?.name || "N/A"}</td>
                  <td>
                    <input
                      type="number"
                      value={i.quantity}
                      min="1"
                      onChange={(e) => orderItemUpdateMutation.mutate({ id: i.id, data: { quantity: Number(e.target.value) } })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={i.unit_price}
                      min="0"
                      step="0.01"
                      onChange={(e) => orderItemUpdateMutation.mutate({ id: i.id, data: { unit_price: Number(e.target.value) } })}
                    />
                  </td>
                  <td>{(i.quantity * i.unit_price).toFixed(2)}</td>
                  <td>
                    <button onClick={() => orderItemDeleteMutation.mutate(i.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
