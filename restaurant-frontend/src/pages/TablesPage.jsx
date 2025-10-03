import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTables, createTable, getTableStatus, updateTableStatus } from "../api/tables";

export default function TablesPage() {
  const queryClient = useQueryClient();

  const [newCode, setNewCode] = useState("");
  const [newSeats, setNewSeats] = useState(2);
  const [newLocation, setNewLocation] = useState("");
  const [editingTableId, setEditingTableId] = useState(null);

  // Fetch mesas
  const { data: tables = [], isLoading: tablesLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
  });

  // Fetch estados
  const { data: tableStatuses = [], isLoading: statusLoading } = useQuery({
    queryKey: ["tableStatus"],
    queryFn: getTableStatus,
  });

  // Mutación para actualizar estado
  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => updateTableStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tableStatus"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      setEditingTableId(null); // salir del modo edición al guardar
    },
  });

  // Mutación para agregar mesa
  const createMutation = useMutation({
    mutationFn: (tableData) => createTable({ ...tableData, is_active: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tables"] }),
  });

  if (tablesLoading || statusLoading) return <div>Cargando mesas...</div>;

  const handleStateChange = (statusObj, newStatus) => {
    if (!newStatus) return;
    updateMutation.mutate({ id: statusObj.id, status: newStatus });
  };

  const handleAddTable = () => {
    if (!newCode || newSeats <= 0) return alert("Código y número de asientos son obligatorios");
    createMutation.mutate({ code: newCode, seats: newSeats, location: newLocation });
    setNewCode("");
    setNewSeats(2);
    setNewLocation("");
  };

  // Colores según estado
  const getColor = (status) => {
    switch (status) {
      case "free": return "green";
      case "occupied": return "red";
      case "reserved": return "yellow";
      case "cleaning": return "blue";
      default: return "gray";
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Mesas del Restaurante</h1>

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

      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {tables.map((table) => {
          const statusObj = tableStatuses.find((s) => s.table_id === table.id);
          const isEditing = editingTableId === table.id;

          return (
            <div
              key={table.id}
              style={{
                width: "160px",
                height: "120px",
                borderRadius: "8px",
                backgroundColor: getColor(statusObj?.status),
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
                cursor: "pointer",
              }}
              onClick={() => setEditingTableId(table.id)}
            >
              <strong>{table.code}</strong>
              <span>{table.seats} asientos</span>
              <span>{table.location}</span>
              {!isEditing ? (
                <small>{statusObj?.status || "N/A"}</small>
              ) : (
                <select
                  value={statusObj?.status || ""}
                  onChange={(e) => handleStateChange(statusObj, e.target.value)}
                  style={{ marginTop: "8px" }}
                  autoFocus
                  onBlur={() => setEditingTableId(null)} // cerrar al salir
                >
                  <option value="">-- Estado --</option>
                  <option value="free">Libre</option>
                  <option value="occupied">Ocupada</option>
                  <option value="reserved">Reservada</option>
                  <option value="cleaning">Limpieza</option>
                </select>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
