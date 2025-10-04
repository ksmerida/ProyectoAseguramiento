import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInventory, createInventory, updateInventory, deleteInventory } from "../api/inventory";
import { colors } from "../theme";

export default function InventoryPage() {
  const queryClient = useQueryClient();

  const [itemName, setItemName] = useState("");
  const [sku, setSku] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [minimumStock, setMinimumStock] = useState(0);
  const [editingItem, setEditingItem] = useState(null);

  const { data: inventory = [], isLoading } = useQuery({ queryKey: ["inventory"], queryFn: getInventory });

  const inventoryMutation = useMutation({
    mutationFn: (data) => editingItem ? updateInventory(editingItem.id, data) : createInventory({ ...data, is_active: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      clearForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInventory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });

  const clearForm = () => {
    setItemName("");
    setSku("");
    setUnit("");
    setQuantity(0);
    setMinimumStock(0);
    setEditingItem(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemName || !unit) return alert("Item Name y Unit son obligatorios");

    inventoryMutation.mutate({ item_name: itemName, sku, unit, quantity, minimum_stock: minimumStock });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setItemName(item.item_name);
    setSku(item.sku || "");
    setUnit(item.unit);
    setQuantity(item.quantity || 0);
    setMinimumStock(item.minimum_stock || 0);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Deseas eliminar este item de inventario?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Cargando inventario...</div>;

  return (
    <div style={{ padding: "20px", backgroundColor: colors.cream, minHeight: "100vh" }}>
      <h1 style={{ color: colors.darkText }}>Inventario</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nombre del item"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Unidad (kg, l, unidad)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ marginRight: "10px", width: "80px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Stock mínimo"
          value={minimumStock}
          onChange={(e) => setMinimumStock(Number(e.target.value))}
          style={{ marginRight: "10px", width: "80px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: colors.jadeGreen,
            color: "#FFF",
            padding: "6px 12px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer"
          }}
        >
          {editingItem ? "Actualizar" : "Agregar"}
        </button>
        {editingItem && (
          <button
            type="button"
            onClick={clearForm}
            style={{
              marginLeft: "10px",
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              cursor: "pointer"
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%", backgroundColor: "#FFF", borderRadius: "4px" }}>
        <thead style={{ backgroundColor: colors.accentOrange, color: "#FFF" }}>
          <tr>
            <th>Nombre</th>
            <th>SKU</th>
            <th>Unidad</th>
            <th>Cantidad</th>
            <th>Stock mínimo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id}>
              <td>{item.item_name}</td>
              <td>{item.sku}</td>
              <td>{item.unit}</td>
              <td>{item.quantity}</td>
              <td>{item.minimum_stock}</td>
              <td>
                <button
                  onClick={() => handleEdit(item)}
                  style={{
                    backgroundColor: colors.jadeGreen,
                    color: "#FFF",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    marginLeft: "5px",
                    backgroundColor: colors.primaryRed,
                    color: "#FFF",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
