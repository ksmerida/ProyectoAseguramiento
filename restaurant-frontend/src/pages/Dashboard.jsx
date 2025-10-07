// src/pages/Dashboard.jsx
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UsersPage from "./UsersPage";
import RolesPage from "./RolesPage";
import CustomersPage from "./CustomersPage";
import MenuCategoriesPage from "./MenuCategoriesPage";
import MenuItemsPage from "./MenuItemsPage";
import InventoryPage from "./InventoryPage";
import RecipeItemsPage from "./RecipeItemsPage";
import OrdersPage from "./OrdersPage";
import TablesPage from "./TablesPage";

export default function Dashboard() {
  return (
    <div className="flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar a la izquierda */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 p-6" style={{ backgroundColor: "#F4F6F8" }}>
        <Routes>
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="menu-categories" element={<MenuCategoriesPage />} />
          <Route path="menu-items" element={<MenuItemsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="recipes" element={<RecipeItemsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="tables" element={<TablesPage />} />

          {/* Mensaje profesional cuando no hay ruta seleccionada */}
          <Route
            path="*"
            element={
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  minHeight: "300px",
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#555",
                  textAlign: "center",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  padding: "20px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  fill="#F57C00"
                  viewBox="0 0 16 16"
                  style={{ marginBottom: "15px" }}
                >
                  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 12A5 5 0 1 1 8 3a5 5 0 0 1 0 10zm-.93-7.588a.5.5 0 1 1 .858.514l-2 3a.5.5 0 0 1-.77.063l-1-1.2a.5.5 0 1 1 .74-.672l.647.776 1.525-2.38z"/>
                </svg>
                Seleccione una opción del menú
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
