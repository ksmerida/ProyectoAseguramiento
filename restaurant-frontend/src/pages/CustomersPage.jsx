import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../api/customers";
import { colors } from "../theme";

export default function CustomersPage() {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);

  const { data: customers = [], isLoading } = useQuery({ queryKey: ["customers"], queryFn: getCustomers });

  const mutation = useMutation({
    mutationFn: (customerData) => editingCustomer ? updateCustomer(editingCustomer.id, customerData) : createCustomer({ ...customerData, is_active: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      clearForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (customerId) => deleteCustomer(customerId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });

  const clearForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setEditingCustomer(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      alert("El nombre del cliente es obligatorio");
      return;
    }
    mutation.mutate({ name, phone, email, notes });
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setName(customer.name);
    setPhone(customer.phone || "");
    setEmail(customer.email || "");
    setNotes(customer.notes || "");
  };

  const handleDelete = (customerId) => {
    if (window.confirm("¿Seguro que quieres eliminar este cliente?")) {
      deleteMutation.mutate(customerId);
    }
  };

  if (isLoading) return <div>Cargando clientes...</div>;

  return (
    <div style={{ padding: "20px", backgroundColor: colors.cream, minHeight: "100vh" }}>
      <h1 style={{ color: colors.darkText }}>Clientes</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
          placeholder="Notas"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: colors.jadeGreen,
            color: "#FFF",
            padding: "6px 12px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer"
          }}
        >
          {editingCustomer ? "Actualizar" : "Agregar"}
        </button>
        {editingCustomer && (
          <button
            type="button"
            onClick={clearForm}
            style={{
              marginLeft: "10px",
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              cursor: "pointer"
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%", backgroundColor: "#FFF", borderRadius: "4px" }}>
        <thead style={{ backgroundColor: colors.accentOrange, color: "#FFF" }}>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Notas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {customers.filter(c => c.is_active).map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.email}</td>
              <td>{c.notes}</td>
              <td>
                <button
                  onClick={() => handleEdit(c)}
                  style={{
                    backgroundColor: colors.jadeGreen,
                    color: "#FFF",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  style={{
                    marginLeft: "5px",
                    backgroundColor: colors.primaryRed,
                    color: "#FFF",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "4px",
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
