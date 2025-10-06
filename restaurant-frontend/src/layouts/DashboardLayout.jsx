import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  // Paleta sin azul
  const colors = {
    rojo: "#D32F2F",
    naranja: "#F57C00",
    amarillo: "#FBC02D",
    verde: "#388E3C",
    beige: "#FFF8E1",
  };

  // Sidebar
  const sidebarStyle = {
    width: 240,
    minHeight: "100vh",
    background: `linear-gradient(180deg, ${colors.amarillo} 0%, ${colors.beige} 100%)`,
    color: "#000",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    fontFamily: "'Montserrat', sans-serif",
  };

  const logoStyle = {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
  };

  const linkStyle = {
    display: "block",
    padding: "12px 16px",
    color: "#000",
    textDecoration: "none",
    fontWeight: 500,
    borderRadius: 8,
    marginBottom: 8,
    transition: "all 0.2s ease",
  };

  const linkHoverStyle = {
    background: colors.rojo,
    color: "#fff",
    transform: "translateX(5px)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  };

  // Main
  const mainStyle = {
    flex: 1,
    background: colors.beige,
    minHeight: "100vh",
    overflowY: "auto",
    fontFamily: "'Montserrat', sans-serif",
    display: "flex",
    flexDirection: "column",
  };

  // Header
  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 30px",
    background: colors.naranja,
    color: "#fff",
    fontWeight: 600,
    fontSize: 18,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  // Logout button
  const logoutButtonStyle = {
    padding: "8px 16px",
    background: colors.rojo,
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s ease",
  };

  const logoutHoverStyle = {
    background: colors.naranja,
    transform: "scale(1.05)",
  };

  const menuItems = [
    { path: "users", label: "Usuarios" },
    { path: "roles", label: "Roles" },
    { path: "customers", label: "Clientes" },
    { path: "tables", label: "Mesas" },
    { path: "menu_items", label: "Ítems de Menú" },
    { path: "menu-categories", label: "Categorías de Menú" },
    { path: "inventory", label: "Inventario" },
    { path: "recipes", label: "Recetas" },
    { path: "orders", label: "Órdenes" },
    { path: "cocina", label: "Cocina" },
  ];

  return (
    <div style={{ display: "flex" }}>
      <aside style={sidebarStyle}>
        <div>
          <div style={logoStyle}>Restaurant GT</div>
          <nav>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {menuItems.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={`/${path}`}
                    style={linkStyle}
                    onMouseEnter={(e) => Object.assign(e.target.style, linkHoverStyle)}
                    onMouseLeave={(e) => Object.assign(e.target.style, linkStyle)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <button
          style={logoutButtonStyle}
          onMouseEnter={(e) => Object.assign(e.target.style, logoutHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.target.style, logoutButtonStyle)}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Cerrar sesión
        </button>
      </aside>

      <main style={mainStyle}>
        <div style={headerStyle}>
          <span>Dashboard</span>
          <span>ADMINISTRADOR</span>
        </div>

        <div style={{ padding: 20, flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
