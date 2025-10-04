import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const sidebarStyle = {
    width: 240,
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0055A4 0%, #FFD700 100%)", // azul guatemalteco → dorado
    color: "#fff",
    padding: "30px 20px",
    boxShadow: "3px 0 10px rgba(0,0,0,0.1)",
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
    color: "#fff",
    textDecoration: "none",
    fontWeight: 500,
    borderRadius: 8,
    marginBottom: 8,
    transition: "all 0.2s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  };

  const linkHoverStyle = {
    background: "#C41E3A", // rojo tradicional guatemalteco
    color: "#fff",
    transform: "translateX(5px)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  };

  const mainStyle = {
    flex: 1,
    padding: "30px",
    background: "#F5F5F5",
    minHeight: "100vh",
    boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)",
    overflowY: "auto",
    fontFamily: "'Montserrat', sans-serif",
  };

  const logoutButtonStyle = {
    padding: "10px 20px",
    background: "linear-gradient(90deg, #C41E3A 0%, #FF7043 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s ease",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  };

  const logoutHoverStyle = {
    background: "linear-gradient(90deg, #FF7043 0%, #C41E3A 100%)",
    transform: "scale(1.05)",
  };

  return (
    <div style={{ display: "flex" }}>
      <aside style={sidebarStyle}>
        <div>
          <div style={logoStyle}>Restaurant GT</div>
          <nav>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[
                { path: "users", label: "Usuarios" },
                { path: "roles", label: "Roles" },
                { path: "customers", label: "Clientes" },
                { path: "tables", label: "Mesas" },
                { path: "menu_items", label: "Menú" },
                { path: "inventory", label: "Inventario" },
                { path: "orders", label: "Órdenes" },
              ].map(({ path, label }) => (
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
        <Outlet />
      </main>
    </div>
  );
}
