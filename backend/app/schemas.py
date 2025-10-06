from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

# ----------------------------
# Roles
# ----------------------------
class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoleCreate(RoleBase):
    pass

class Role(RoleBase):
    id: uuid.UUID
    is_active: bool
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

# ----------------------------
# Users
# ----------------------------
class UserBase(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str
    role_id: uuid.UUID

class User(UserBase):
    id: uuid.UUID
    role_id: uuid.UUID
    is_active: bool
    created_at: Optional[datetime]
    last_login: Optional[datetime]

    class Config:
        from_attributes = True

# ----------------------------
# Customers
# ----------------------------
class CustomerBase(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    notes: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: uuid.UUID
    is_active: bool
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

# ----------------------------
# Tables
# ----------------------------
class TableBase(BaseModel):
    code: str
    seats: int
    location: Optional[str] = None

class TableCreate(TableBase):
    pass

class TableWithStatus(TableBase):
    id: uuid.UUID
    is_active: bool
    created_at: datetime
    status: str
    status_id: Optional[uuid.UUID]

    class Config:
        from_attributes = True  # Pydantic V2

# ----------------------------
# Table Status
# ----------------------------
class TableStatusBase(BaseModel):
    table_id: uuid.UUID
    status: str
    updated_by: Optional[uuid.UUID] = None

class TableStatusCreate(TableStatusBase):
    pass

class TableStatus(TableStatusBase):
    id: uuid.UUID
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# ----------------------------
# Schema para actualizar solo el estado
# ----------------------------
class TableStatusUpdate(BaseModel):
    status: str

# ----------------------------
# Reservations
# ----------------------------
class ReservationBase(BaseModel):
    customer_id: Optional[uuid.UUID] = None
    reserved_at: datetime
    people_smallint: int
    table_id: Optional[uuid.UUID] = None
    status: Optional[str] = "confirmed"
    notes: Optional[str] = None
    created_by: Optional[uuid.UUID] = None

class ReservationCreate(ReservationBase):
    pass

class Reservation(ReservationBase):
    id: uuid.UUID
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

# ----------------------------
# Menu Categories
# ----------------------------
class MenuCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    sort_order: Optional[int] = 0

class MenuCategoryCreate(MenuCategoryBase):
    pass

class MenuCategory(MenuCategoryBase):
    id: uuid.UUID
    is_active: bool
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

# ----------------------------
# Menu Items
# ----------------------------
class MenuItemBase(BaseModel):
    code: Optional[str] = None
    name: str
    description: Optional[str] = None
    category_id: Optional[uuid.UUID] = None
    price: float
    tax_rate: Optional[float] = 0.0
    is_available: Optional[bool] = True
    requires_kitchen: Optional[bool] = True

class MenuItemCreate(MenuItemBase):
    pass

class MenuItem(MenuItemBase):
    id: uuid.UUID
    is_active: bool
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

# ----------------------------
# Inventory
# ----------------------------
class InventoryBase(BaseModel):
    item_name: str
    sku: Optional[str] = None
    unit: str
    quantity: Optional[float] = 0
    minimum_stock: Optional[float] = 0

class InventoryCreate(InventoryBase):
    pass

class Inventory(InventoryBase):
    id: uuid.UUID
    is_active: bool
    last_updated: Optional[datetime]

    class Config:
        from_attributes = True

# ----------------------------
# Recipe Items
# ----------------------------
class RecipeItemBase(BaseModel):
    menu_item_id: uuid.UUID
    inventory_id: uuid.UUID
    quantity: float
    unit: Optional[str] = None

class RecipeItemCreate(RecipeItemBase):
    pass

class RecipeItem(RecipeItemBase):
    id: uuid.UUID
    is_active: bool

    class Config:
        from_attributes = True

# ----------------------------
# Orders
# ----------------------------
class OrderBase(BaseModel):
    table_id: Optional[uuid.UUID] = None
    customer_id: Optional[uuid.UUID] = None
    created_by: Optional[uuid.UUID] = None
    status: Optional[str] = "pending"
    is_takeaway: Optional[bool] = False

class OrderCreate(OrderBase):
    order_code: Optional[str] = None

class Order(OrderBase):
    id: uuid.UUID
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# ----------------------------
# Order Items
# ----------------------------
class OrderItemBase(BaseModel):
    order_id: uuid.UUID
    menu_item_id: uuid.UUID
    quantity: int
    unit_price: float
    tax_rate: Optional[float] = 0.0
    notes: Optional[str] = None
    status: Optional[str] = "pending"

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: uuid.UUID
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

# ----------------------------
# Kitchen Tickets
# ----------------------------
class KitchenTicketBase(BaseModel):
    order_id: Optional[uuid.UUID] = None
    printed: Optional[bool] = False
    priority: Optional[int] = 0

class KitchenTicketCreate(KitchenTicketBase):
    pass

class KitchenTicket(KitchenTicketBase):
    id: uuid.UUID
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

# ----------------------------
# Invoices
# ----------------------------
class InvoiceBase(BaseModel):
    order_id: Optional[uuid.UUID] = None
    subtotal: float
    tax_total: Optional[float] = 0
    tip_amount: Optional[float] = 0
    discount_amount: Optional[float] = 0
    total: float
    created_by: Optional[uuid.UUID] = None
    paid: Optional[bool] = False

class InvoiceCreate(InvoiceBase):
    invoice_number: Optional[str] = None

class Invoice(InvoiceBase):
    id: uuid.UUID
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

# ----------------------------
# Payments
# ----------------------------
class PaymentBase(BaseModel):
    invoice_id: uuid.UUID
    method: str
    amount: float
    transaction_ref: Optional[str] = None
    created_by: Optional[uuid.UUID] = None

class PaymentCreate(PaymentBase):
    pass

class Payment(PaymentBase):
    id: uuid.UUID
    paid_at: Optional[datetime]

    class Config:
        from_attributes = True

# ----------------------------
# Audit Logs
# ----------------------------
class AuditLogBase(BaseModel):
    entity: str
    entity_id: Optional[uuid.UUID] = None
    action: str
    old_data: Optional[dict] = None
    new_data: Optional[dict] = None
    performed_by: Optional[uuid.UUID] = None
    reason: Optional[str] = None

class AuditLogCreate(AuditLogBase):
    pass

class AuditLog(AuditLogBase):
    id: uuid.UUID
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

# ----------------------------
# Auth Tokens
# ----------------------------
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
