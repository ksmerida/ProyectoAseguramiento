import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, updateOrder, getOrderItems } from "../api/orders";
import { colors } from "../theme";

export default function CocinaPage() {
  const queryClient = useQueryClient();

  // Obtener órdenes filtrando por estados relevantes para cocina
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", "kitchen"],
    queryFn: () => getOrders().then(data => data.filter(o => ["pending", "confirmed", "seated"].includes(o.status))),
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const { data: items = [], refetch: refetchItems } = useQuery({
    queryKey: ["orderItems", selectedOrder?.id],
    queryFn: () => getOrderItems(selectedOrder.id),
    enabled: !!selectedOrder,
  });

  const orderUpdateMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrder(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", "kitchen"] });
      if (selectedOrder) refetchItems();
    },
  });

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleStatusChange = (newStatus) => {
    if (!selectedOrder) return;
    orderUpdateMutation.mutate({ id: selectedOrder.id, status: newStatus });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return colors.accentOrange;
      case "confirmed": return colors.jadeGreen;
      case "seated": return colors.blueSky;
      case "cancelled": return colors.primaryRed;
      case "no_show": return colors.gray;
      default: return colors.darkText;
    }
  };

  if (isLoading) return <div>Cargando órdenes...</div>;

  return (
    <div style={{ padding: "20px", backgroundColor: colors.cream, minHeight: "100vh" }}>
      <h1 style={{ color: colors.darkText }}>Panel de Cocina</h1>

      {/* Tabla de órdenes */}
      <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%", marginBottom: "20px", backgroundColor: "#FFF", borderRadius: "4px" }}>
        <thead style={{ backgroundColor: colors.jadeGreen, color: "#FFF" }}>
          <tr>
            <th>Mesa</th>
            <th>Cliente</th>
            <th>Status</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => {
            const isSelected = selectedOrder?.id === o.id;
            const orderTotal = isSelected ? items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0) : 0;
            return (
              <tr key={o.id} style={{ backgroundColor: isSelected ? "#eee" : "transparent" }}>
                <td>{o.table_id || "Takeaway"}</td>
                <td>{o.customer_id || "N/A"}</td>
                <td style={{ color: getStatusColor(o.status) }}>{o.status}</td>
                <td>{isSelected ? orderTotal.toFixed(2) : "-"}</td>
                <td>
                  <button
                    onClick={() => handleSelectOrder(o)}
                    style={{ backgroundColor: colors.accentOrange, color: "#FFF", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Ver Detalle
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Detalle de items */}
      {selectedOrder && (
        <>
          <h2 style={{ color: colors.darkText }}>Items de la Orden</h2>
          <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%", backgroundColor: "#FFF", borderRadius: "4px", marginBottom: "20px" }}>
            <thead style={{ backgroundColor: colors.accentOrange, color: "#FFF" }}>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id}>
                  <td>{i.menu_item_name || "Producto"}</td>
                  <td>{i.quantity}</td>
                  <td>{i.unit_price.toFixed(2)}</td>
                  <td>{(i.quantity * i.unit_price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cambiar estado de la orden */}
          <div>
            {selectedOrder.status === "pending" && (
              <button onClick={() => handleStatusChange("confirmed")} style={{ marginRight: "10px", padding: "6px 12px", backgroundColor: colors.jadeGreen, color: "#FFF", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                Marcar como Confirmada
              </button>
            )}
            {selectedOrder.status === "confirmed" && (
              <button onClick={() => handleStatusChange("seated")} style={{ marginRight: "10px", padding: "6px 12px", backgroundColor: colors.blueSky, color: "#FFF", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                Marcar como En Preparación
              </button>
            )}
            {selectedOrder.status === "seated" && (
              <button onClick={() => handleStatusChange("ready")} style={{ marginRight: "10px", padding: "6px 12px", backgroundColor: colors.primaryRed, color: "#FFF", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                Marcar como Listo
              </button>
            )}
            <button onClick={() => setSelectedOrder(null)} style={{ padding: "6px 12px", borderRadius: "4px" }}>
              Cerrar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
