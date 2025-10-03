// UsersPage.jsx
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser, updateUser, deleteUser } from "../api/users";
import axios from "axios";

const apiUrl = "http://localhost:8000"; // Cambiar si tu backend tiene otra URL

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

  // ✅ Fetch users (solo activos)
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const data = await getUsers();
      return data.filter(u => u.is_active);
    },
  });

  // ✅ Create / Update user
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

  // ✅ Delete user (lógico)
  const deleteMutation = useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  // Clear form
  const clearForm = () => {
    setUsername("");
    setEmail("");
    setFullName("");
    setPassword("");
    setRoleId("");
    setEditingUser(null);
  };

  // Submit form
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
    <div style={{ padding: "20px" }}>
      <h1>Usuarios</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <select
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          style={{ marginRight: "10px" }}
        >
          <option value="">Selecciona un rol</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        <button type="submit">{editingUser ? "Actualizar" : "Agregar"}</button>
        {editingUser && (
          <button type="button" onClick={clearForm} style={{ marginLeft: "10px" }}>
            Cancelar
          </button>
        )}
      </form>

      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>Role</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.full_name}</td>
              <td>{roles.find(r => r.id === u.role_id)?.name || "N/A"}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Editar</button>
                <button onClick={() => handleDelete(u.id)} style={{ marginLeft: "5px" }}>
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
