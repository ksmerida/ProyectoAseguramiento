import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTables, createTable, updateTableStatus } from "../api/tables";

export default function TablesPage() {
  const queryClient = useQueryClient();

  const [newCode, setNewCode] = React.useState("");
  const [newSeats, setNewSeats] = React.useState(2);
  const [newLocation, setNewLocation] = React.useState("");

  // Fetch mesas con estado
  const { data: tables = [], isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
  });

  // Mutación para actualizar estado
  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => updateTableStatus(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tables"] }),
  });

  // Mutación para agregar mesa
  const createMutation = useMutation({
    mutationFn: (tableData) => createTable({ ...tableData, is_active: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tables"] }),
  });

  if (isLoading) return <div>Cargando mesas...</div>;

  const handleAddTable = () => {
    if (!newCode || newSeats <= 0)
      return alert("Código y número de asientos son obligatorios");

    createMutation.mutate({
      code: newCode,
      seats: newSeats,
      location: newLocation,
    });

    setNewCode("");
    setNewSeats(2);
    setNewLocation("");
  };

  const getColor = (status) => {
    switch (status) {
      case "free":
        return "green";
      case "occupied":
        return "red";
      case "reserved":
        return "orange";
      case "cleaning":
        return "blue";
      default:
        return "gray";
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Mesas del Restaurante</h1>

      {/* Formulario para agregar nueva mesa */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Agregar nueva mesa</h3>
        <input
          placeholder="Código"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Asientos"
          value={newSeats}
          onChange={(e) => setNewSeats(Number(e.target.value))}
          style={{ width: "80px", marginRight: "10px" }}
        />
        <input
          placeholder="Ubicación"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleAddTable}>Agregar Mesa</button>
      </div>

      {/* Mostrar mesas */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {tables.map((table) => (
          <div
            key={table.id}
            style={{
              width: "160px",
              height: "140px",
              borderRadius: "8px",
              backgroundColor: getColor(table.status),
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <strong>{table.code}</strong>
            <span>{table.seats} asientos</span>
            <span>{table.location}</span>

            {/* Select para cambiar estado */}
            <select
              value={table.status || "free"}
              onChange={(e) =>
                updateMutation.mutate({
                  id: table.status_id,
                  status: e.target.value,
                })
              }
              style={{
                marginTop: "10px",
                padding: "4px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
            >
              <option value="free">Libre</option>
              <option value="occupied">Ocupada</option>
              <option value="reserved">Reservada</option>
              <option value="cleaning">Limpieza</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}