import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInventory, createInventory, updateInventory, deleteInventory } from "../api/inventory";

export default function InventoryPage() {
  const queryClient = useQueryClient();

  const [itemName, setItemName] = useState("");
  const [sku, setSku] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [minimumStock, setMinimumStock] = useState(0);
  const [editingItem, setEditingItem] = useState(null);

  // ✅ Fetch inventory
  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: getInventory
  });

  // ✅ Mutation para crear/actualizar
  const inventoryMutation = useMutation({
    mutationFn: (data) => {
      if (editingItem) {
        return updateInventory(editingItem.id, data);
      } else {
        return createInventory({ ...data, is_active: true });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      clearForm();
    }
  });

  // ✅ Delete (lógico)
  const deleteMutation = useMutation({
    mutationFn: deleteInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    }
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
    <div style={{ padding: "20px" }}>
      <h1>Inventario</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nombre del item"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Unidad (kg, l, unidad)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ marginRight: "10px", width: "80px" }}
        />
        <input
          type="number"
          placeholder="Stock mínimo"
          value={minimumStock}
          onChange={(e) => setMinimumStock(Number(e.target.value))}
          style={{ marginRight: "10px", width: "80px" }}
        />
        <button type="submit">{editingItem ? "Actualizar" : "Agregar"}</button>
        {editingItem && <button type="button" onClick={clearForm} style={{ marginLeft: "10px" }}>Cancelar</button>}
      </form>

      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
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
                <button onClick={() => handleEdit(item)}>Editar</button>
                <button onClick={() => handleDelete(item.id)} style={{ marginLeft: "5px" }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
