import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoles, createRole, updateRole, deleteRole } from "../api/roles";
import { colors } from "../theme";

export default function RolesPage() {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingRole, setEditingRole] = useState(null);

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const mutation = useMutation({
    mutationFn: (roleData) => {
      if (editingRole) return updateRole(editingRole.id, roleData);
      return createRole({ ...roleData, is_active: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      clearForm();
    },
  });

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
    if (!name) return alert("El nombre del rol es obligatorio");
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
    <div style={{ padding: "20px", backgroundColor: colors.cream, minHeight: "100vh" }}>
      <h1 style={{ color: colors.darkText }}>Roles</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nombre del rol"
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
        <button
          type="submit"
          style={{
            backgroundColor: colors.primaryRed,
            color: "#FFF",
            padding: "8px 12px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {editingRole ? "Actualizar" : "Agregar"}
        </button>
        {editingRole && (
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
              cursor: "pointer",
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
          {roles
            .filter((r) => r.is_active)
            .map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid #ccc" }}>
                <td style={{ padding: "8px", color: colors.darkText }}>{r.name}</td>
                <td style={{ padding: "8px", color: colors.darkText }}>{r.description}</td>
                <td style={{ padding: "8px" }}>
                  <button
                    onClick={() => handleEdit(r)}
                    style={{
                      backgroundColor: colors.accentOrange,
                      color: "#FFF",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
                      marginRight: "5px",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    style={{
                      backgroundColor: colors.primaryRed,
                      color: "#FFF",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
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
