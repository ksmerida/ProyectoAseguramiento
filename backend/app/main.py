from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.routers import (
    auth, users, roles,
    customers, tables, table_status,
    reservations, menu_categories, menu_items,
    inventory, recipe_items, orders, order_items,
    kitchen_tickets, invoices, payments, audit_logs
)

app = FastAPI(title="Restaurant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://proyecto-aseguramiento.vercel.app"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers de autenticación y usuarios/roles
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(roles.router)

# Routers de clientes y mesas
app.include_router(customers.router)
app.include_router(tables.router)
app.include_router(table_status.router)

# Routers de reservas y menú
app.include_router(reservations.router)
app.include_router(menu_categories.router)
app.include_router(menu_items.router)

# Routers de inventario y recetas
app.include_router(inventory.router)
app.include_router(recipe_items.router)

# Routers de pedidos y items de pedido
app.include_router(orders.router)
app.include_router(order_items.router)

# Routers de cocina, facturas y pagos
app.include_router(kitchen_tickets.router)
app.include_router(invoices.router)
app.include_router(payments.router)

# Router de auditoría
app.include_router(audit_logs.router)

@app.get("/")
def root():
    return {"message": "API Restaurant funcionando"}
