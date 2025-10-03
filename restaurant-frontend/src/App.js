// src/App.js
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import RolesPage from "./pages/RolesPage";
import CustomersPage from "./pages/CustomersPage";
import MenuCategoriesPage from "./pages/MenuCategoriesPage";
import MenuItemsPage from "./pages/MenuItemsPage";
import InventoryPage from "./pages/InventoryPage";
import RecipeItemsPage from "./pages/RecipeItemsPages";
import OrdersPage from "./pages/OrdersPage";
import TablesPage from "./pages/TablesPage";


function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/users">Usuarios</Link></li>
          <li><Link to="/roles">Roles</Link></li>
          <li><Link to="/customers">Clientes</Link></li>
          <li><Link to="/menu_categories">Categorias de Menú</Link></li>
          <li><Link to="/menu_items">Items Menú</Link></li>
          <li><Link to="/inventory">Inventario</Link></li>
          <li><Link to="/recipe_items">Items Recetas</Link></li>
          <li><Link to="/orders">Ordenes</Link></li>
          <li><Link to="/tables">Mesas</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/users" element={<UsersPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/menu_categories" element={<MenuCategoriesPage />} />
        <Route path="/menu_items" element={<MenuItemsPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/recipe_items" element={<RecipeItemsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/" element={<h1>Bienvenido al sistema del restaurante 🍽️</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
