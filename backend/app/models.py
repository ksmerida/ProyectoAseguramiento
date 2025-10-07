from sqlalchemy import Column, String, Boolean, ForeignKey, Text, TIMESTAMP, SmallInteger, Integer, Numeric, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid

# ----------------------------
# Roles
# ----------------------------
class Role(Base):
    __tablename__ = "roles"
    __table_args__ = {"schema": "restaurant"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(32), unique=True, nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, default=func.now())

    users = relationship("User", back_populates="role")


# ----------------------------
# Users
# ----------------------------
class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "restaurant"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(255), unique=True)
    password_hash = Column(Text, nullable=False)
    full_name = Column(String(255))
    role_id = Column(UUID(as_uuid=True), ForeignKey("restaurant.roles.id", ondelete="RESTRICT"))
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, default=func.now())
    last_login = Column(TIMESTAMP)

    role = relationship("Role", back_populates="users")
    reservations_created = relationship("Reservation", back_populates="created_by_user", foreign_keys='Reservation.created_by')
    table_status_updated = relationship("TableStatus", back_populates="user")
    orders_created = relationship("Order", back_populates="created_by_user", foreign_keys='Order.created_by')
    invoices_created = relationship("Invoice", back_populates="created_by_user")
    payments_created = relationship("Payment", back_populates="created_by_user")
    audit_logs = relationship("AuditLog", back_populates="performed_by_user")


# ----------------------------
# Customers
# ----------------------------
class Customer(Base):
    __tablename__ = "customers"
    __table_args__ = {"schema": "restaurant"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    phone = Column(String(50))
    email = Column(String(255))
    notes = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, default=func.now())

    reservations = relationship("Reservation", back_populates="customer")
    orders = relationship("Order", back_populates="customer")


# ----------------------------
# Tables
# ----------------------------
class Table(Base):
    __tablename__ = "tables"
    __table_args__ = {"schema": "restaurant"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(50), nullable=False, unique=True)
    seats = Column(SmallInteger, nullable=False)
    location = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, default=func.now())

    status = relationship("TableStatus", back_populates="table", uselist=False)
    reservations = relationship("Reservation", back_populates="table")
    orders = relationship("Order", back_populates="table")


# ----------------------------
# Table Status
# ----------------------------
class TableStatus(Base):
    __tablename__ = "table_status"
    __table_args__ = {"schema": "restaurant"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    table_id = Column(UUID(as_uuid=True), ForeignKey("restaurant.tables.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(32), nullable=False)
    updated_by = Column(UUID(as_uuid=True), ForeignKey("restaurant.users.id", ondelete="SET NULL"))
    updated_at = Column(TIMESTAMP, default=func.now())

    table = relationship("Table", back_populates="status")
    user = relationship("User", back_populates="table_status_updated")


# ----------------------------
# Reservations
# ----------------------------
class Reservation(Base):
    __tablename__ = "reservations"
    __table_args__ = {"schema": "restaurant"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("restaurant.customers.id", ondelete="SET NULL"))
    reserved_at = Column(TIMESTAMP, nullable=False)
    people_smallint = Column(SmallInteger, nullable=False)
    table_id = Column(UUID(as_uuid=True), ForeignKey("restaurant.tables.id", ondelete="SET NULL"))
    status = Column(String(32), default="confirmed")
    notes = Column(Text)
    created_by = Column(UUID(as_uuid=True), ForeignKey("restaurant.users.id", ondelete="SET NULL"))
    created_at = Column(TIMESTAMP, default=func.now())

    customer = relationship("Customer", back_populates="reservations")
    table = relationship("Table", back_populates="reservations")
    created_by_user = relationship("User", back_populates="reservations_created")


# ----------------------------
# Menu Categories
# ----------------------------
class MenuCategory(Base):
    __tablename__ = "menu_categories"
    __table_args__ = {"schema": "restaurant"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, default=func.now())

    menu_items = relationship("MenuItem", back_populates="category")


# ----------------------------
# Menu Items
# ----------------------------
class MenuItem(Base):
    __tablename__ = "menu_items"
    __table_args__ = {"schema": "restaurant"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(50), unique=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    category_id = Column(UUID(as_uuid=True), ForeignKey("restaurant.menu_categories.id", ondelete="SET NULL"))
    price = Column(Numeric(10,2), nullable=False)
    tax_rate = Column(Numeric(4,2), default=0.00)
    is_available = Column(Boolean, default=True)
    requires_kitchen = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, default=func.now())
    category = relationship("MenuCategory", back_populates="menu_items")
    recipe_items = relationship("RecipeItem", back_populates="menu_item")
    order_items = relationship("OrderItem", back_populates="menu_item")


# ----------------------------
# Inventory
# ----------------------------
class Inventory(Base):
    __tablename__ = "inventory"
    __table_args__ = {"schema": "restaurant"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_name = Column(String(255), nullable=False)
    sku = Column(String(100), unique=True)
    unit = Column(String(20), nullable=False)
    quantity = Column(Numeric(12,3), default=0)
    minimum_stock = Column(Numeric(12,3), default=0)
    is_active = Column(Boolean, default=True)  # Delete lógico
    last_updated = Column(TIMESTAMP, default=func.now(), onupdate=func.now())
    recipe_items = relationship("RecipeItem", back_populates="inventory")


# ----------------------------
# Recipe Items
# ----------------------------
class RecipeItem(Base):
    __tablename__ = "recipe_items"
    __table_args__ = {"schema": "restaurant"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    menu_item_id = Column(UUID(as_uuid=True), ForeignKey("restaurant.menu_items.id", ondelete="CASCADE"))
    inventory_id = Column(UUID(as_uuid=True), ForeignKey("restaurant.inventory.id", ondelete="RESTRICT"))
    quantity = Column(Numeric(12,4), nullable=False)
    unit = Column(String(20))
    is_active = Column(Boolean, default=True)
    menu_item = relationship("MenuItem", back_populates="recipe_items")
    inventory = relationship("Inventory", back_populates="recipe_items")


# ----------------------------
# Orders
# ----------------------------
class Order(Base):
    __tablename__ = "orders"
    __table_args__ = {"schema": "restaurant"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_code = Column(String(50), unique=True)
    table_id = Column(UUID(as_uuid=True), ForeignKey("restaurant.tables.id", ondelete="SET NULL"))
    customer_id = Column(UUID(as_uuid=True), ForeignKey("restaurant.customers.id", ondelete="SET NULL"))
    created_by = Column(UUID(as_uuid=True), ForeignKey("restaurant.users.id", ondelete="SET NULL"))
    status = Column(String(32), default="pending")
    is_takeaway = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, default=func.now())
    updated_at = Column(TIMESTAMP, default=func.now())

    table = relationship("Table", back_populates="orders")
    customer = relationship("Customer", back_populates="orders")
    created_by_user = relationship("User", back_populates="orders_created")
    order_items = relationship("OrderItem", back_populates="order")
    kitchen_tickets = relationship("KitchenTicket", back_populates="order")
    invoices = relationship("Invoice", back_populates="order")


# ----------------------------
# Order Items
# ----------------------------
class OrderItem(Base):
    __tablename__ = "order_items"
    __table_args__ = {"schema": "restaurant"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("restaurant.orders.id", ondelete="CASCADE"), nullable=False)
    menu_item_id = Column(UUID(as_uuid=True), ForeignKey("restaurant.menu_items.id", ondelete="RESTRICT"), nullable=False)
    quantity = Column(SmallInteger, nullable=False)
    unit_price = Column(Numeric(10,2), nullable=False)
    tax_rate = Column(Numeric(4,2), default=0.00)
    notes = Column(Text)
    status = Column(String(32), default="pending")
    created_at = Column(TIMESTAMP, default=func.now())

    order = relationship("Order", back_populates="order_items")
    menu_item = relationship("MenuItem", back_populates="order_items")


# ----------------------------
# Kitchen Tickets
# ----------------------------
class KitchenTicket(Base):
    __tablename__ = "kitchen_tickets"
    __table_args__ = {"schema": "restaurant"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("restaurant.orders.id", ondelete="CASCADE"))
    printed = Column(Boolean, default=False)
    priority = Column(Integer, default=0)
    created_at = Column(TIMESTAMP, default=func.now())

    order = relationship("Order", back_populates="kitchen_tickets")


# ----------------------------
# Invoices
# ----------------------------
class Invoice(Base):
    __tablename__ = "invoices"
    __table_args__ = {"schema": "restaurant"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    invoice_number = Column(String(50), unique=True)
    order_id = Column(UUID(as_uuid=True), ForeignKey("restaurant.orders.id", ondelete="SET NULL"))
    subtotal = Column(Numeric(12,2), nullable=False)
    tax_total = Column(Numeric(12,2), default=0)
    tip_amount = Column(Numeric(12,2), default=0)
    discount_amount = Column(Numeric(12,2), default=0)
    total = Column(Numeric(12,2), nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("restaurant.users.id", ondelete="SET NULL"))
    created_at = Column(TIMESTAMP, default=func.now())
    paid = Column(Boolean, default=False)

    order = relationship("Order", back_populates="invoices")
    created_by_user = relationship("User", back_populates="invoices_created")
    payments = relationship("Payment", back_populates="invoice")


# ----------------------------
# Payments
# ----------------------------
class Payment(Base):
    __tablename__ = "payments"
    __table_args__ = {"schema": "restaurant"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    invoice_id = Column(UUID(as_uuid=True), ForeignKey("restaurant.invoices.id", ondelete="CASCADE"))
    method = Column(String(50), nullable=False)
    amount = Column(Numeric(12,2), nullable=False)
    transaction_ref = Column(String(255))
    paid_at = Column(TIMESTAMP, default=func.now())
    created_by = Column(UUID(as_uuid=True), ForeignKey("restaurant.users.id", ondelete="SET NULL"))

    invoice = relationship("Invoice", back_populates="payments")
    created_by_user = relationship("User", back_populates="payments_created")


# ----------------------------
# Audit Logs
# ----------------------------
class AuditLog(Base):
    __tablename__ = "audit_logs"
    __table_args__ = {"schema": "restaurant"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity = Column(String(100), nullable=False)
    entity_id = Column(UUID)
    action = Column(String(50), nullable=False)
    old_data = Column(JSON)
    new_data = Column(JSON)
    performed_by = Column(UUID(as_uuid=True), ForeignKey("restaurant.users.id", ondelete="SET NULL"))
    reason = Column(Text)
    created_at = Column(TIMESTAMP, default=func.now())

    performed_by_user = relationship("User", back_populates="audit_logs")
