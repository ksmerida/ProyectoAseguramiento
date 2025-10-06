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
import CocinaPage from "./KitchenPage"; // <-- import agregado

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
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
          <Route path="cocina" element={<CocinaPage />} /> {/* <-- ruta agregada */}
          <Route path="*" element={<h2>Seleccione una opción del menú</h2>} />
        </Routes>
      </div>
    </div>
  );
}
