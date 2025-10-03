import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getMenuItems, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem, 
  getCategories 
} from "../api/menu_items";

export default function MenuItemsPage() {
  const queryClient = useQueryClient();

  // Form state
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [requiresKitchen, setRequiresKitchen] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  // Cargar categorías
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  });

  // Cargar items activos
  const { data: menuItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ["menu_items"],
    queryFn: async () => {
      const data = await getMenuItems();
      return data.filter(item => item.is_active);
    }
  });

  // Crear / actualizar item
  const mutation = useMutation({
    mutationFn: (itemData) => {
      if (editingItem) {
        return updateMenuItem(editingItem.id, itemData);
      }
      return createMenuItem({ ...itemData, is_active: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu_items"] });
      clearForm();
    }
  });

  // Eliminar item (lógico)
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu_items"] });
    }
  });

  const clearForm = () => {
    setCode("");
    setName("");
    setDescription("");
    setCategoryId("");
    setPrice(0);
    setTaxRate(0);
    setIsAvailable(true);
    setRequiresKitchen(true);
    setEditingItem(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      return alert("Nombre, precio y categoría son obligatorios");
    }
    mutation.mutate({
      code,
      name,
      description,
      category_id: categoryId,
      price,
      tax_rate: taxRate,
      is_available: isAvailable,
      requires_kitchen: requiresKitchen
    });
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setCode(item.code || "");
    setName(item.name);
    setDescription(item.description || "");
    setCategoryId(item.category_id || "");
    setPrice(item.price);
    setTaxRate(item.tax_rate || 0);
    setIsAvailable(item.is_available);
    setRequiresKitchen(item.requires_kitchen);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Deseas eliminar este item?")) {
      deleteMutation.mutate(id);
    }
  };

  if (categoriesLoading || itemsLoading) return <div>Cargando...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Menu Items</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Código"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ marginRight: "10px" }}
        >
          <option value="">Selecciona categoría</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Precio"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          style={{ marginRight: "10px", width: "80px" }}
        />
        <input
          type="number"
          placeholder="Tax"
          value={taxRate}
          onChange={(e) => setTaxRate(Number(e.target.value))}
          style={{ marginRight: "10px", width: "60px" }}
        />
        <label>
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
          Disponible
        </label>
        <label style={{ marginLeft: "10px" }}>
          <input
            type="checkbox"
            checked={requiresKitchen}
            onChange={(e) => setRequiresKitchen(e.target.checked)}
          />
          Requiere Cocina
        </label>
        <button type="submit" style={{ marginLeft: "10px" }}>
          {editingItem ? "Actualizar" : "Agregar"}
        </button>
        {editingItem && (
          <button type="button" onClick={clearForm} style={{ marginLeft: "10px" }}>
            Cancelar
          </button>
        )}
      </form>

      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Tax</th>
            <th>Disponible</th>
            <th>Requiere Cocina</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map(item => (
            <tr key={item.id}>
              <td>{item.code}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{categories.find(c => c.id === item.category_id)?.name || "N/A"}</td>
              <td>{item.price}</td>
              <td>{item.tax_rate}</td>
              <td>{item.is_available ? "Sí" : "No"}</td>
              <td>{item.requires_kitchen ? "Sí" : "No"}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Editar</button>
                <button onClick={() => handleDelete(item.id)} style={{ marginLeft: "5px" }}>
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
