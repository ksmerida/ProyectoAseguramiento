import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "../api/customers";

export default function CustomersPage() {
  const queryClient = useQueryClient();

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Fetch customers
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  // Create / Update customer
  const mutation = useMutation({
    mutationFn: (customerData) => {
      if (editingCustomer) {
        return updateCustomer(editingCustomer.id, customerData);
      } else {
        return createCustomer({ ...customerData, is_active: true }); // activo por defecto
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      clearForm();
    },
  });

  // Delete customer (lógico)
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
    <div style={{ padding: "20px" }}>
      <h1>Clientes</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
          placeholder="Notas"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button type="submit">{editingCustomer ? "Actualizar" : "Agregar"}</button>
        {editingCustomer && (
          <button type="button" onClick={clearForm} style={{ marginLeft: "10px" }}>
            Cancelar
          </button>
        )}
      </form>

      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Notas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {customers
            .filter(c => c.is_active)
            .map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
                <td>{c.notes}</td>
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
