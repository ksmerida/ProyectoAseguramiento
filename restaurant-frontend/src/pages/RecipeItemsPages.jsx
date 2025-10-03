import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRecipeItems,
  createRecipeItem,
  updateRecipeItem,
  deleteRecipeItem,
  getMenuItems,
  getInventory
} from "../api/recipeItems";

export default function RecipeItemsPage() {
  const queryClient = useQueryClient();

  // Form state
  const [menuItemId, setMenuItemId] = useState("");
  const [inventoryId, setInventoryId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  // Fetch menu items y inventory para selects
  const { data: menuItems = [] } = useQuery({ queryKey: ["menuItems"], queryFn: getMenuItems });
  const { data: inventory = [] } = useQuery({ queryKey: ["inventory"], queryFn: getInventory });

  // Fetch recipe items
  const { data: recipeItems = [], isLoading } = useQuery({
    queryKey: ["recipeItems"],
    queryFn: getRecipeItems
  });

  // Mutation create/update
  const mutation = useMutation({
    mutationFn: (data) => {
      if (editingItem) {
        return updateRecipeItem(editingItem.id, data);
      } else {
        return createRecipeItem({ ...data, is_active: true });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipeItems"] });
      clearForm();
    }
  });

  // Mutation delete
  const deleteMutation = useMutation({
    mutationFn: deleteRecipeItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recipeItems"] })
  });

  const clearForm = () => {
    setMenuItemId("");
    setInventoryId("");
    setQuantity(0);
    setUnit("");
    setEditingItem(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!menuItemId || !inventoryId || !quantity) return alert("Todos los campos obligatorios");

    mutation.mutate({ menu_item_id: menuItemId, inventory_id: inventoryId, quantity, unit });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setMenuItemId(item.menu_item_id);
    setInventoryId(item.inventory_id);
    setQuantity(item.quantity);
    setUnit(item.unit || "");
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Deseas eliminar este Recipe Item?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Cargando Recipe Items...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Recipe Items</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <select value={menuItemId} onChange={(e) => setMenuItemId(e.target.value)} style={{ marginRight: "10px" }}>
          <option value="">Selecciona un menú</option>
          {menuItems.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        <select value={inventoryId} onChange={(e) => setInventoryId(e.target.value)} style={{ marginRight: "10px" }}>
          <option value="">Selecciona un inventario</option>
          {inventory.map((i) => (
            <option key={i.id} value={i.id}>{i.item_name}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Cantidad"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ marginRight: "10px", width: "80px" }}
        />

        <input
          type="text"
          placeholder="Unidad"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          style={{ marginRight: "10px" }}
        />

        <button type="submit">{editingItem ? "Actualizar" : "Agregar"}</button>
        {editingItem && <button type="button" onClick={clearForm} style={{ marginLeft: "10px" }}>Cancelar</button>}
      </form>

      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Menu Item</th>
            <th>Inventory</th>
            <th>Cantidad</th>
            <th>Unidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {recipeItems.map((item) => (
            <tr key={item.id}>
              <td>{menuItems.find(m => m.id === item.menu_item_id)?.name || "N/A"}</td>
              <td>{inventory.find(i => i.id === item.inventory_id)?.item_name || "N/A"}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
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
