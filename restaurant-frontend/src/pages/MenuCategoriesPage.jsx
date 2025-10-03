import React, { useState, useEffect } from "react";
import axios from "axios";

const apiUrl = "http://127.0.0.1:8000";

export default function MenuCategoriesPages() {
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
      // Actualizar categoría
      await axios.put(`${apiUrl}/menu_categories/${editingCategory.id}`, payload);
    } else {
      // Crear categoría
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
    <div style={{ padding: "20px" }}>
      <h1>Categorías de Menú</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nombre de categoría"
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
        <button type="submit">{editingCategory ? "Actualizar" : "Agregar"}</button>
        {editingCategory && (
          <button type="button" onClick={clearForm} style={{ marginLeft: "10px" }}>
            Cancelar
          </button>
        )}
      </form>

      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories
            .filter(c => c.is_active)
            .map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.description}</td>
                <td>
                  <button onClick={() => handleEdit(c)}>Editar</button>
                  <button onClick={() => handleDelete(c.id)} style={{ marginLeft: "5px" }}>
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
