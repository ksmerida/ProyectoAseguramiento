import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import RolesPage from "./pages/RolesPage";
import CustomersPage from "./pages/CustomersPage";
import TablesPage from "./pages/TablesPage";
import MenuItemsPage from "./pages/MenuItemsPage";
import InventoryPage from "./pages/InventoryPage";
import OrdersPage from "./pages/OrdersPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<h2>Panel principal</h2>} />
        <Route path="users" element={<UsersPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="tables" element={<TablesPage />} />
        <Route path="menu_items" element={<MenuItemsPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>
    </Routes>
  );
}
