import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getMenuItems, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem, 
  getCategories 
} from "../api/menu_items";
import { colors } from "../theme";

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
    <div style={{ padding: "20px", backgroundColor: colors.cream, minHeight: "100vh" }}>
      <h1 style={{ color: colors.darkText }}>Items de Menú</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Código"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
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
          style={{ marginRight: "10px", width: "80px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Tax"
          value={taxRate}
          onChange={(e) => setTaxRate(Number(e.target.value))}
          style={{ marginRight: "10px", width: "60px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <label style={{ marginRight: "10px" }}>
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          /> Disponible
        </label>
        <label style={{ marginRight: "10px" }}>
          <input
            type="checkbox"
            checked={requiresKitchen}
            onChange={(e) => setRequiresKitchen(e.target.checked)}
          /> Requiere Cocina
        </label>
        <button
          type="submit"
          style={{
            marginLeft: "10px",
            backgroundColor: colors.primaryRed,
            color: "#FFF",
            padding: "8px 12px",
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
              backgroundColor: colors.cream,
              border: `1px solid ${colors.primaryRed}`,
              color: colors.primaryRed,
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* Tabla */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: colors.jadeGreen, color: "#FFF" }}>
          <tr>
            <th style={{ padding: "8px" }}>Código</th>
            <th style={{ padding: "8px" }}>Nombre</th>
            <th style={{ padding: "8px" }}>Descripción</th>
            <th style={{ padding: "8px" }}>Categoría</th>
            <th style={{ padding: "8px" }}>Precio</th>
            <th style={{ padding: "8px" }}>Tax</th>
            <th style={{ padding: "8px" }}>Disponible</th>
            <th style={{ padding: "8px" }}>Requiere Cocina</th>
            <th style={{ padding: "8px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map(item => (
            <tr key={item.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={{ padding: "8px", color: colors.darkText }}>{item.code}</td>
              <td style={{ padding: "8px", color: colors.darkText }}>{item.name}</td>
              <td style={{ padding: "8px", color: colors.darkText }}>{item.description}</td>
              <td style={{ padding: "8px", color: colors.darkText }}>
                {categories.find(c => c.id === item.category_id)?.name || "N/A"}
              </td>
              <td style={{ padding: "8px", color: colors.darkText }}>{item.price}</td>
              <td style={{ padding: "8px", color: colors.darkText }}>{item.tax_rate}</td>
              <td style={{ padding: "8px", color: colors.darkText }}>{item.is_available ? "Sí" : "No"}</td>
              <td style={{ padding: "8px", color: colors.darkText }}>{item.requires_kitchen ? "Sí" : "No"}</td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => handleEdit(item)}
                  style={{
                    backgroundColor: colors.accentOrange,
                    color: "#FFF",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                    marginRight: "5px"
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    backgroundColor: colors.primaryRed,
                    color: "#FFF",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "none",
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
