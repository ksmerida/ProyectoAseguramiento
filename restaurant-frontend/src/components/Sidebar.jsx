import { Link, useLocation, useNavigate } from "react-router-dom";

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

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col">
      <div className="mb-6">
        <h1>Dashboard</h1>
        <h2 className="text-lg font-bold">{user.username || "Usuario"}</h2>
        <p className="text-sm text-gray-300">{roleFromUser.toUpperCase()}</p>
        <button
          onClick={handleLogout}
          className="mt-3 w-full bg-red-500 py-1 rounded hover:bg-red-600 text-white text-sm"
        >
          Cerrar sesión
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {menuByRole[role]?.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`block py-2 px-3 rounded hover:bg-gray-700 ${
                isActive ? "bg-gray-700 font-semibold" : ""
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
