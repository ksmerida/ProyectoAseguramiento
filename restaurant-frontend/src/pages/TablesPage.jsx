import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTables, createTable, getTableStatus, updateTableStatus } from "../api/tables";
import { colors } from "../theme";

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
      setEditingTableId(null);
    },
  });

  // Mutación para agregar mesa
  const createMutation = useMutation({
    mutationFn: (tableData) => createTable({ ...tableData, is_active: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tables"] }),
  });

  if (tablesLoading || statusLoading) return <div>Cargando mesas...</div>;

  const handleAddTable = () => {
    if (!newCode || newSeats <= 0) return alert("Código y número de asientos son obligatorios");
    createMutation.mutate({ code: newCode, seats: newSeats, location: newLocation });
    setNewCode("");
    setNewSeats(2);
    setNewLocation("");
  };

  // Colores según estado usando paleta guatemalteca
  const getColor = (status) => {
    switch (status) {
      case "free":
        return colors.jadeGreen;
      case "occupied":
        return colors.primaryRed;
      case "reserved":
        return colors.accentOrange;
      case "cleaning":
        return colors.blueSky;
      default:
        return colors.gray;
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: colors.cream, minHeight: "100vh" }}>
      <h1 style={{ color: colors.darkText }}>Mesas del Restaurante</h1>

      {/* Agregar nueva mesa */}
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ color: colors.darkText }}>Agregar nueva mesa</h3>
        <input
          placeholder="Código"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Asientos"
          value={newSeats}
          onChange={(e) => setNewSeats(Number(e.target.value))}
          style={{ width: "80px", marginRight: "10px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          placeholder="Ubicación"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button
          onClick={handleAddTable}
          style={{
            backgroundColor: colors.primaryRed,
            color: "#FFF",
            padding: "8px 12px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Agregar Mesa
        </button>
      </div>

      {/* Listado de mesas */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {tables.map((table) => {
          // Buscar el estado correspondiente; si no existe, usar valores por defecto
          const statusObj = tableStatuses.find((s) => s.table_id === table.id) || { id: null, status: "free" };
          const isEditing = editingTableId === table.id;

          // Mapear valores internos a etiquetas en español
          const statusLabels = {
            free: "Libre",
            occupied: "Ocupada",
            reserved: "Reservada",
            cleaning: "Limpieza",
          };

          const handleChange = (newStatus) => {
            if (!statusObj.id || !newStatus) return; // Evita crash si no hay id
            updateMutation.mutate({ id: statusObj.id, status: newStatus });
          };

          return (
            <div
              key={table.id}
              style={{
                width: "160px",
                height: "120px",
                borderRadius: "8px",
                backgroundColor: getColor(statusObj.status),
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
              onClick={() => setEditingTableId(table.id)}
            >
              <strong>{table.code}</strong>
              <span>{table.seats} asientos</span>
              <span>{table.location}</span>

              {!isEditing ? (
                <small>{statusLabels[statusObj.status] || "N/A"}</small>
              ) : (
                <select
                  value={statusObj.status || ""}
                  onChange={(e) => handleChange(e.target.value)}
                  style={{ marginTop: "8px", borderRadius: "4px", padding: "4px" }}
                  autoFocus
                  onBlur={() => setEditingTableId(null)}
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
