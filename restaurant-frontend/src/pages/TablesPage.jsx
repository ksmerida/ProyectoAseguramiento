import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTables, createTable, updateTableStatus, deleteTable } from "../api/tables";

export default function TablesPage() {
  const queryClient = useQueryClient();

  const [newCode, setNewCode] = React.useState("");
  const [newSeats, setNewSeats] = React.useState(2);
  const [newLocation, setNewLocation] = React.useState("");

  // ----------------------------
  // Obtener mesas
  // ----------------------------
  const { data: tables = [], isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
  });

  // ----------------------------
  // Mutación para actualizar estado
  // ----------------------------
  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => updateTableStatus(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["tables"] });
      const previousTables = queryClient.getQueryData(["tables"]);
      queryClient.setQueryData(["tables"], (old) =>
        old.map((t) => (t.id === id ? { ...t, status } : t))
      );
      return { previousTables };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["tables"], context.previousTables);
      alert("Error al actualizar el estado de la mesa");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tables"] }),
  });

  // ----------------------------
  // Mutación para crear mesa
  // ----------------------------
  const createMutation = useMutation({
    mutationFn: (tableData) => createTable({ ...tableData, is_active: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tables"] }),
  });

  // ----------------------------
  // Mutación para eliminar mesa (optimista)
  // ----------------------------
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteTable(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tables"] });
      const previousTables = queryClient.getQueryData(["tables"]);
      queryClient.setQueryData(["tables"], (old) => old.filter((t) => t.id !== id));
      return { previousTables };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["tables"], context.previousTables);
      alert("Error al eliminar la mesa");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tables"] }),
  });

  if (isLoading) return <div>Cargando mesas...</div>;

  // ----------------------------
  // Agregar nueva mesa
  // ----------------------------
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

  // ----------------------------
  // Colores según estado
  // ----------------------------
  const getColor = (status) => {
    switch (status) {
      case "free":
        return "#388E3C";
      case "occupied":
        return "#D32F2F";
      case "reserved":
        return "#F57C00";
      case "cleaning":
        return "#FBC02D";
      default:
        return "#BDBDBD";
    }
  };

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div style={{ padding: "20px", fontFamily: "'Montserrat', sans-serif" }}>
      <h1 style={{ marginBottom: "20px", color: "#000000" }}>Mesas del Restaurante</h1>

      {/* Formulario agregar mesa */}
      <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#FFF8E1", borderRadius: 8 }}>
        <h3 style={{ marginBottom: "10px", color: "#000000" }}>Agregar nueva mesa</h3>
        <input
          placeholder="Código"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Asientos"
          value={newSeats}
          onChange={(e) => setNewSeats(Number(e.target.value))}
          style={{ width: "80px", marginRight: "10px", padding: "6px", borderRadius: 4, border: "1px solid #ccc" }}
        />
        <input
          placeholder="Ubicación"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          style={{ marginRight: "10px", padding: "6px", borderRadius: 4, border: "1px solid #ccc" }}
        />
        <button
          onClick={handleAddTable}
          style={{
            padding: "8px 16px",
            backgroundColor: "#D32F2F",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#F57C00")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#D32F2F")}
        >
          Agregar Mesa
        </button>
      </div>

      {/* Mostrar mesas */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {tables.map((table) => {
          const status = table.status?.toLowerCase() || "free";
          return (
            <div
              key={table.id}
              style={{
                width: "160px",
                height: "160px",
                borderRadius: "8px",
                backgroundColor: getColor(status),
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                position: "relative"
              }}
            >
              <strong style={{ fontSize: "18px" }}>{table.code}</strong>
              <span>{table.seats} asientos</span>
              <span>{table.location}</span>

              {/* Select estado */}
              <select
                value={status}
                onChange={(e) =>
                  updateMutation.mutate({ id: table.id, status: e.target.value })
                }
                style={{
                  marginTop: "10px",
                  padding: "4px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  backgroundColor: "#FFF8E1",
                  color: "#000",
                }}
              >
                <option value="free">Libre</option>
                <option value="occupied">Ocupada</option>
                <option value="reserved">Reservada</option>
                <option value="cleaning">Limpieza</option>
              </select>

              {/* Botón eliminar */}
              <button
                onClick={() => {
                  if (window.confirm(`¿Eliminar mesa ${table.code}?`)) {
                    deleteMutation.mutate(table.id);
                  }
                }}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  backgroundColor: "#D32F2F",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#F57C00")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#D32F2F")}
              >
                X
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
