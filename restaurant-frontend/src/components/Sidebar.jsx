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
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // para menú móvil

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const roleMapping = {
    Administrador: "admin",
    Mesero: "mesero",
    Cocina: "cocina",
    Cajero: "cajero",
  };
  const roleFromUser = user.role || "mesero";
  const role = roleMapping[roleFromUser] || "mesero";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header
      style={{
        background: "#D32F2F",
        position: "absolute",
        top: 0,
        width: "100%",
        zIndex: 1000,
        padding: "2px 200px",
        display: "flex",
        justifyContent: "space-between",
        boxShadow: "0 4px 2px rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "'Montserrat', sans-serif",
          color: "#FFF8E1",
        }}
      >
        {/* Logo */}
        <div style={{ fontWeight: "bold", fontSize: "18px" }}>Sabor a Guatemala</div>

        {/* Botón hamburguesa móvil */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "25px",
            height: "20px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <span style={{ display: "block", height: "3px", background: "#FFF8E1", borderRadius: "2px" }}></span>
          <span style={{ display: "block", height: "3px", background: "#FFF8E1", borderRadius: "2px" }}></span>
          <span style={{ display: "block", height: "3px", background: "#FFF8E1", borderRadius: "2px" }}></span>
        </button>

        {/* Menú */}
        <nav
          style={{
            display: "flex",
            gap: "15px",
            flexDirection: "row",
          }}
          className={menuOpen ? "open" : ""}
        >
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
                  padding: "4px 0",
                  textDecoration: "none",
                  fontWeight: isActive ? 700 : 500,
                  color: "#FFF8E1",
                  fontSize: "14px",
                  transition: "color 0.3s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    height: "2px",
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontWeight: 600, fontSize: "14px" }}>{user.username || "Usuario"}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              backgroundColor: "#F57C00",
              color: "#FFF8E1",
              border: "none",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#FFD700")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#F57C00")}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* CSS para responsive */}
      <style>
        {`
          @media (max-width: 768px) {
            .menu-toggle {
              display: flex;
            }
            nav {
              position: absolute;
              top: 50px;
              left: 0;
              right: 0;
              background: #D32F2F;
              flex-direction: column;
              align-items: center;
              gap: 10px;
              padding: 10px 0;
              display: none;
            }
            nav.open {
              display: flex;
            }
          }
        `}
      </style>
    </header>
  );
}
