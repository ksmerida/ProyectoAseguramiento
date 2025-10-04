import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser, updateUser, deleteUser } from "../api/users";
import axios from "axios";
import { colors } from "../theme";

const apiUrl = "http://localhost:8000";

export default function UsersPage() {
  const queryClient = useQueryClient();

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");

  // Edit state
  const [editingUser, setEditingUser] = useState(null);

  // Roles
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    axios.get(`${apiUrl}/roles`)
      .then(res => setRoles(res.data.filter(r => r.is_active)))
      .catch(err => console.error("Error cargando roles:", err));
  }, []);

  // Fetch users (solo activos)
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const data = await getUsers();
      return data.filter(u => u.is_active);
    },
  });

  // Create / Update user
  const mutation = useMutation({
    mutationFn: (userData) => {
      if (editingUser) {
        return updateUser(editingUser.id, userData);
      } else {
        return createUser({ ...userData, is_active: true });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      clearForm();
    },
  });

  // Delete user (lógico)
  const deleteMutation = useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const clearForm = () => {
    setUsername("");
    setEmail("");
    setFullName("");
    setPassword("");
    setRoleId("");
    setEditingUser(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password || !roleId) {
      alert("Username, password y role son obligatorios");
      return;
    }
    mutation.mutate({
      username,
      email,
      full_name: fullName,
      password,
      role_id: roleId,
    });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setUsername(user.username);
    setEmail(user.email);
    setFullName(user.full_name);
    setRoleId(user.role_id);
  };

  const handleDelete = (userId) => {
    if (window.confirm("¿Seguro que quieres eliminar este usuario?")) {
      deleteMutation.mutate(userId);
    }
  };

  if (usersLoading) return <div>Cargando usuarios...</div>;

  return (
    <div style={{ padding: "20px", backgroundColor: colors.cream, minHeight: "100vh" }}>
      <h1 style={{ color: colors.darkText }}>Usuarios</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <select
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="">Selecciona un rol</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
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
          {editingUser ? "Actualizar" : "Agregar"}
        </button>
        {editingUser && (
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
            <th style={{ padding: "8px" }}>Username</th>
            <th style={{ padding: "8px" }}>Email</th>
            <th style={{ padding: "8px" }}>Full Name</th>
            <th style={{ padding: "8px" }}>Role</th>
            <th style={{ padding: "8px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={{ padding: "8px", color: colors.darkText }}>{u.username}</td>
              <td style={{ padding: "8px", color: colors.darkText }}>{u.email}</td>
              <td style={{ padding: "8px", color: colors.darkText }}>{u.full_name}</td>
              <td style={{ padding: "8px", color: colors.darkText }}>
                {roles.find(r => r.id === u.role_id)?.name || "N/A"}
              </td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => handleEdit(u)}
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
                  onClick={() => handleDelete(u.id)}
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
