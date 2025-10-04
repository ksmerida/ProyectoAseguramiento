import React, { useState, useEffect } from "react";
import axios from "axios";
import { colors } from "../theme";

const apiUrl = "http://127.0.0.1:8000";

export default function MenuCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [editingCategory, setEditingCategory] = useState(null);

  // Cargar categorías
  useEffect(() => {
    axios.get(`${apiUrl}/menu_categories`).then((res) => {
      setCategories(res.data.filter(c => c.is_active));
    });
  }, []);

  const clearForm = () => {
    setName("");
    setDescription("");
    setSortOrder(0);
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return alert("El nombre es obligatorio");

    const payload = { name, description, sort_order: sortOrder, is_active: true };

    if (editingCategory) {
      await axios.put(`${apiUrl}/menu_categories/${editingCategory.id}`, payload);
    } else {
      await axios.post(`${apiUrl}/menu_categories`, payload);
    }

    const res = await axios.get(`${apiUrl}/menu_categories`);
    setCategories(res.data.filter(c => c.is_active));
    clearForm();
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || "");
    setSortOrder(category.sort_order || 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta categoría?")) return;
    await axios.delete(`${apiUrl}/menu_categories/${id}`);
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div style={{ padding: "20px", backgroundColor: colors.cream, minHeight: "100vh" }}>
      <h1 style={{ color: colors.darkText }}>Categorías de Menú</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nombre de categoría"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            marginRight: "10px",
            padding: "6px",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            marginRight: "10px",
            padding: "6px",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: colors.primaryRed,
            color: "#FFF",
            padding: "8px 12px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer"
          }}
        >
          {editingCategory ? "Actualizar" : "Agregar"}
        </button>
        {editingCategory && (
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
            <th style={{ padding: "8px" }}>Nombre</th>
            <th style={{ padding: "8px" }}>Descripción</th>
            <th style={{ padding: "8px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={{ padding: "8px", color: colors.darkText }}>{c.name}</td>
              <td style={{ padding: "8px", color: colors.darkText }}>{c.description}</td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => handleEdit(c)}
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
                  onClick={() => handleDelete(c.id)}
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
