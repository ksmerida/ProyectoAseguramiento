import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 220, padding: 16, borderRight: "1px solid #eee" }}>
        <h3>Restaurant</h3>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li><Link to="/users">Usuarios</Link></li>
            <li><Link to="/roles">Roles</Link></li>
            <li><Link to="/customers">Clientes</Link></li>
            <li><Link to="/tables">Mesas</Link></li>
            <li><Link to="/menu_items">Menú</Link></li>
            <li><Link to="/inventory">Inventario</Link></li>
            <li><Link to="/orders">Órdenes</Link></li>
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}>Cerrar sesión</button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
