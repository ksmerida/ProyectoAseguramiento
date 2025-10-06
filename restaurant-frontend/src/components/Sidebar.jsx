import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const menuByRole = {
  admin: [
    { path: "/dashboard/users", label: "Usuarios" },
    { path: "/dashboard/roles", label: "Roles" },
    { path: "/dashboard/customers", label: "Clientes" },
    { path: "/dashboard/menu-categories", label: "Categorías de Menú" },
    { path: "/dashboard/menu-items", label: "Ítems de Menú" },
    { path: "/dashboard/inventory", label: "Inventario" },
    { path: "/dashboard/recipes", label: "Recetas" },
    { path: "/dashboard/orders", label: "Órdenes" },
    { path: "/dashboard/tables", label: "Mesas" },
  ],
  mesero: [
    { path: "/dashboard/tables", label: "Mesas" },
    { path: "/dashboard/menu-items", label: "Menú" },
    { path: "/dashboard/orders", label: "Órdenes" },
  ],
  cocina: [
    { path: "/dashboard/orders", label: "Órdenes" },
    { path: "/dashboard/recipes", label: "Recetas" },
    { path: "/dashboard/inventory", label: "Inventario" },
  ],
  cajero: [
    { path: "/dashboard/invoices", label: "Facturas" },
    { path: "/dashboard/payments", label: "Pagos" },
  ],
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  // Normalizar rol a minúsculas para evitar problemas de coincidencia
  const roleMapping = {
    administrador: "admin",
    mesero: "mesero",
    cocina: "cocina",
    cajero: "cajero",
  };
  const roleFromUser = (user.role || "mesero").toLowerCase();
  const role = roleMapping[roleFromUser] || "mesero";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#D32F2F",
        padding: "10px 30px",
        color: "#FFF8E1",
        fontFamily: "'Montserrat', sans-serif",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <div style={{ fontWeight: "bold", fontSize: "22px" }}>Sabor a Guatemala</div>

      {/* Menú horizontal con animación underline */}
      <nav style={{ display: "flex", gap: "20px" }}>
        {menuByRole[role]?.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                position: "relative",
                padding: "8px 0",
                textDecoration: "none",
                fontWeight: isActive ? 700 : 500,
                color: "#FFF8E1",
                transition: "color 0.3s ease",
              }}
            >
              {item.label}
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  height: "3px",
                  width: isActive || hoveredIndex === idx ? "100%" : "0%",
                  background: "#FBC02D",
                  transition: "width 0.3s ease",
                  borderRadius: "2px",
                }}
              />
            </Link>
          );
        })}
      </nav>

      {/* Usuario y logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span style={{ fontWeight: 600 }}>{user.username || "Usuario"}</span>
        <button
          onClick={handleLogout}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            backgroundColor: "#F57C00",
            color: "#FFF8E1",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#FFD700")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#F57C00")}
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
