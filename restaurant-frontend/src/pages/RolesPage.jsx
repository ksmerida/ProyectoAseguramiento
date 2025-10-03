// RolesPage.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoles, createRole, updateRole, deleteRole } from "../api/roles";

export default function RolesPage() {
  const queryClient = useQueryClient();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingRole, setEditingRole] = useState(null);

  // Fetch roles
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  // Create / Update role
  const mutation = useMutation({
    mutationFn: (roleData) => {
      if (editingRole) {
        return updateRole(editingRole.id, roleData);
      } else {
        return createRole({ ...roleData, is_active: true }); // por defecto true al crear
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      clearForm();
    },
  });

  // Delete role (lógico)
  const deleteMutation = useMutation({
    mutationFn: (roleId) => deleteRole(roleId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  const clearForm = () => {
    setName("");
    setDescription("");
    setEditingRole(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      alert("El nombre del rol es obligatorio");
      return;
    }
    mutation.mutate({ name, description });
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setName(role.name);
    setDescription(role.description || "");
  };

  const handleDelete = (roleId) => {
    if (window.confirm("¿Seguro que quieres eliminar este rol?")) {
      deleteMutation.mutate(roleId);
    }
  };

  if (isLoading) return <div>Cargando roles...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Roles</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nombre del rol"
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
        <button type="submit">{editingRole ? "Actualizar" : "Agregar"}</button>
        {editingRole && (
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
          {roles
            .filter(r => r.is_active)
            .map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.description}</td>
                <td>
                  <button onClick={() => handleEdit(r)}>Editar</button>
                  <button onClick={() => handleDelete(r.id)} style={{ marginLeft: "5px" }}>
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
