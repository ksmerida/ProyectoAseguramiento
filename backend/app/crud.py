from sqlalchemy.orm import Session
from app import models, schemas
from app.auth.hashing import Hasher
from typing import List
import uuid

# ----------------------------
# Roles CRUD
# ----------------------------
def create_role(db: Session, role: schemas.RoleCreate):
    db_role = models.Role(name=role.name, description=role.description)
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

def get_roles(db: Session) -> List[models.Role]:
    return db.query(models.Role).filter(models.Role.is_active == True).all()

def get_role(db: Session, role_id: uuid.UUID):
    return db.query(models.Role).filter(models.Role.id == role_id).first()

def update_role(db: Session, role_id: uuid.UUID, role: schemas.RoleCreate):
    db_role = get_role(db, role_id)
    if db_role:
        db_role.name = role.name
        db_role.description = role.description
        db.commit()
        db.refresh(db_role)
    return db_role

def delete_role(db: Session, role_id: uuid.UUID):
    db_role = get_role(db, role_id)
    if db_role:
        db_role.is_active = False
        db.commit()
    return db_role


# ----------------------------
# Users CRUD
# ----------------------------
def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = Hasher.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=hashed_pw,
        full_name=user.full_name,
        role_id=user.role_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session) -> List[models.User]:
    return db.query(models.User).filter(models.User.is_active == True).all()

def get_user(db: Session, user_id: uuid.UUID):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def update_user(db: Session, user_id: uuid.UUID, user_data: schemas.UserCreate):
    db_user = get_user(db, user_id)
    if db_user:
        db_user.username = user_data.username
        db_user.email = user_data.email
        db_user.full_name = user_data.full_name
        db_user.role_id = user_data.role_id
        if user_data.password:
            db_user.password_hash = Hasher.get_password_hash(user_data.password)
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: uuid.UUID):
    db_user = get_user(db, user_id)
    if db_user:
        db_user.is_active = False
        db.commit()
    return db_user


# ----------------------------
# Customers CRUD
# ----------------------------
def create_customer(db: Session, customer: schemas.CustomerCreate):
    db_customer = models.Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def get_customers(db: Session) -> List[models.Customer]:
    return db.query(models.Customer).filter(models.Customer.is_active == True).all()

def get_customer(db: Session, customer_id: uuid.UUID):
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()

def update_customer(db: Session, customer_id: uuid.UUID, customer_data: schemas.CustomerCreate):
    db_customer = get_customer(db, customer_id)
    if db_customer:
        for key, value in customer_data.dict(exclude_unset=True).items():
            setattr(db_customer, key, value)
        db.commit()
        db.refresh(db_customer)
    return db_customer

def delete_customer(db: Session, customer_id: uuid.UUID):
    db_customer = get_customer(db, customer_id)
    if db_customer:
        db_customer.is_active = False
        db.commit()
    return db_customer


# ----------------------------
# Tables CRUD
# ----------------------------
def create_table(db: Session, table: schemas.TableCreate):
    db_table = models.Table(**table.dict())
    db.add(db_table)
    db.commit()
    db.refresh(db_table)
    return db_table

def get_tables(db: Session) -> List[models.Table]:
    return db.query(models.Table).filter(models.Table.is_active == True).all()

def get_table(db: Session, table_id: uuid.UUID):
    return db.query(models.Table).filter(models.Table.id == table_id).first()

def update_table(db: Session, table_id: uuid.UUID, table_data: schemas.TableCreate):
    db_table = get_table(db, table_id)
    if db_table:
        for key, value in table_data.dict(exclude_unset=True).items():
            setattr(db_table, key, value)
        db.commit()
        db.refresh(db_table)
    return db_table

def delete_table(db: Session, table_id: uuid.UUID):
    db_table = get_table(db, table_id)
    if db_table:
        db_table.is_active = False
        db.commit()
    return db_table


# ----------------------------
# TableStatus CRUD
# ----------------------------
def create_table_status(db: Session, table_status: schemas.TableStatusCreate):
    db_status = models.TableStatus(**table_status.dict())
    db.add(db_status)
    db.commit()
    db.refresh(db_status)
    return db_status

def get_table_status(db: Session) -> List[models.TableStatus]:
    return db.query(models.TableStatus).all()

def get_table_status_by_id(db: Session, status_id: uuid.UUID):
    return db.query(models.TableStatus).filter(models.TableStatus.id == status_id).first()

def update_table_status(db: Session, status_id: uuid.UUID, status_data: schemas.TableStatusCreate):
    db_status = get_table_status_by_id(db, status_id)
    if db_status:
        for key, value in status_data.dict(exclude_unset=True).items():
            setattr(db_status, key, value)
        db.commit()
        db.refresh(db_status)
    return db_status

def delete_table_status(db: Session, status_id: uuid.UUID):
    db_status = get_table_status_by_id(db, status_id)
    if db_status:
        db.delete(db_status)
        db.commit()
    return db_status

# ----------------------------
# Reservations CRUD
# ----------------------------
def create_reservation(db: Session, reservation: schemas.ReservationCreate):
    db_reservation = models.Reservation(**reservation.dict())
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation

def get_reservations(db: Session) -> List[models.Reservation]:
    return db.query(models.Reservation).all()

def get_reservation(db: Session, reservation_id: uuid.UUID):
    return db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()

def update_reservation(db: Session, reservation_id: uuid.UUID, reservation_data: schemas.ReservationCreate):
    db_reservation = get_reservation(db, reservation_id)
    if db_reservation:
        for key, value in reservation_data.dict(exclude_unset=True).items():
            setattr(db_reservation, key, value)
        db.commit()
        db.refresh(db_reservation)
    return db_reservation

def delete_reservation(db: Session, reservation_id: uuid.UUID):
    db_reservation = get_reservation(db, reservation_id)
    if db_reservation:
        db.delete(db_reservation)
        db.commit()
    return db_reservation


# ----------------------------
# MenuCategories CRUD
# ----------------------------
def create_menu_category(db: Session, category: schemas.MenuCategoryCreate):
    db_category = models.MenuCategory(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_menu_categories(db: Session) -> List[models.MenuCategory]:
    return db.query(models.MenuCategory).filter(models.MenuCategory.is_active == True).all()

def get_menu_category(db: Session, category_id: uuid.UUID):
    return db.query(models.MenuCategory).filter(models.MenuCategory.id == category_id).first()

def update_menu_category(db: Session, category_id: uuid.UUID, category_data: schemas.MenuCategoryCreate):
    db_category = get_menu_category(db, category_id)
    if db_category:
        for key, value in category_data.dict(exclude_unset=True).items():
            setattr(db_category, key, value)
        db.commit()
        db.refresh(db_category)
    return db_category

def delete_menu_category(db: Session, category_id: uuid.UUID):
    db_category = get_menu_category(db, category_id)
    if db_category:
        db_category.is_active = False
        db.commit()
    return db_category


# ----------------------------
# MenuItems CRUD
# ----------------------------
def create_menu_item(db: Session, item: schemas.MenuItemCreate):
    db_item = models.MenuItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_menu_items(db: Session) -> List[models.MenuItem]:
    return db.query(models.MenuItem).filter(models.MenuItem.is_active == True).all()

def get_menu_item(db: Session, item_id: uuid.UUID):
    return db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()

def update_menu_item(db: Session, item_id: uuid.UUID, item_data: schemas.MenuItemCreate):
    db_item = get_menu_item(db, item_id)
    if db_item:
        for key, value in item_data.dict(exclude_unset=True).items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
    return db_item

def delete_menu_item(db: Session, item_id: uuid.UUID):
    db_item = get_menu_item(db, item_id)
    if db_item:
        db_item.is_active = False
        db.commit()
    return db_item


# ----------------------------
# Inventory CRUD
# ----------------------------
def create_inventory(db: Session, inventory: schemas.InventoryCreate):
    db_inventory = models.Inventory(**inventory.dict())
    db.add(db_inventory)
    db.commit()
    db.refresh(db_inventory)
    return db_inventory

def get_inventory(db: Session) -> List[models.Inventory]:
    return db.query(models.Inventory).filter(models.Inventory.is_active == True).all()

def get_inventory_item(db: Session, inventory_id: uuid.UUID):
    return db.query(models.Inventory).filter(models.Inventory.id == inventory_id).first()

def update_inventory(db: Session, inventory_id: uuid.UUID, inventory_data: schemas.InventoryCreate):
    db_inventory = get_inventory_item(db, inventory_id)
    if db_inventory:
        for key, value in inventory_data.dict(exclude_unset=True).items():
            setattr(db_inventory, key, value)
        db.commit()
        db.refresh(db_inventory)
    return db_inventory

def delete_inventory(db: Session, inventory_id: uuid.UUID):
    db_inventory = get_inventory_item(db, inventory_id)
    if db_inventory:
        db_inventory.is_active = False  # delete lógico
        db.commit()
        db.refresh(db_inventory)
    return db_inventory



# ----------------------------
# RecipeItems CRUD
# ----------------------------
def create_recipe_item(db: Session, recipe_item: schemas.RecipeItemCreate):
    db_recipe = models.RecipeItem(**recipe_item.dict())
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

def get_recipe_items(db: Session) -> List[models.RecipeItem]:
    return db.query(models.RecipeItem).filter(models.RecipeItem.is_active == True).all()

def get_recipe_item(db: Session, recipe_item_id: uuid.UUID):
    return db.query(models.RecipeItem).filter(models.RecipeItem.id == recipe_item_id).first()

def update_recipe_item(db: Session, recipe_item_id: uuid.UUID, recipe_data: schemas.RecipeItemCreate):
    db_recipe = get_recipe_item(db, recipe_item_id)
    if db_recipe:
        for key, value in recipe_data.dict(exclude_unset=True).items():
            setattr(db_recipe, key, value)
        db.commit()
        db.refresh(db_recipe)
    return db_recipe

def delete_recipe_item(db: Session, recipe_item_id: uuid.UUID):
    db_recipe = get_recipe_item(db, recipe_item_id)
    if db_recipe:
        db_recipe.is_active = False
        db.commit()
    return db_recipe

# ----------------------------
# Orders CRUD
# ----------------------------
def create_order(db: Session, order: schemas.OrderCreate):
    db_order = models.Order(**order.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders(db: Session) -> List[models.Order]:
    return db.query(models.Order).all()

def get_order(db: Session, order_id: uuid.UUID):
    return db.query(models.Order).filter(models.Order.id == order_id).first()

def update_order(db: Session, order_id: uuid.UUID, order_data: schemas.OrderCreate):
    db_order = get_order(db, order_id)
    if db_order:
        for key, value in order_data.dict(exclude_unset=True).items():
            setattr(db_order, key, value)
        db.commit()
        db.refresh(db_order)
    return db_order

def delete_order(db: Session, order_id: uuid.UUID):
    db_order = get_order(db, order_id)
    if db_order:
        db.delete(db_order)
        db.commit()
    return db_order


# ----------------------------
# OrderItems CRUD
# ----------------------------
def create_order_item(db: Session, item: schemas.OrderItemCreate):
    db_item = models.OrderItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_order_items(db: Session) -> List[models.OrderItem]:
    return db.query(models.OrderItem).all()

def get_order_item(db: Session, item_id: uuid.UUID):
    return db.query(models.OrderItem).filter(models.OrderItem.id == item_id).first()

def update_order_item(db: Session, item_id: uuid.UUID, item_data: schemas.OrderItemCreate):
    db_item = get_order_item(db, item_id)
    if db_item:
        for key, value in item_data.dict(exclude_unset=True).items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
    return db_item

def delete_order_item(db: Session, item_id: uuid.UUID):
    db_item = get_order_item(db, item_id)
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item


# ----------------------------
# KitchenTickets CRUD
# ----------------------------
def create_kitchen_ticket(db: Session, ticket: schemas.KitchenTicketCreate):
    db_ticket = models.KitchenTicket(**ticket.dict())
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def get_kitchen_tickets(db: Session) -> List[models.KitchenTicket]:
    return db.query(models.KitchenTicket).all()

def get_kitchen_ticket(db: Session, ticket_id: uuid.UUID):
    return db.query(models.KitchenTicket).filter(models.KitchenTicket.id == ticket_id).first()

def update_kitchen_ticket(db: Session, ticket_id: uuid.UUID, ticket_data: schemas.KitchenTicketCreate):
    db_ticket = get_kitchen_ticket(db, ticket_id)
    if db_ticket:
        for key, value in ticket_data.dict(exclude_unset=True).items():
            setattr(db_ticket, key, value)
        db.commit()
        db.refresh(db_ticket)
    return db_ticket

def delete_kitchen_ticket(db: Session, ticket_id: uuid.UUID):
    db_ticket = get_kitchen_ticket(db, ticket_id)
    if db_ticket:
        db.delete(db_ticket)
        db.commit()
    return db_ticket


# ----------------------------
# Invoices CRUD
# ----------------------------
def create_invoice(db: Session, invoice: schemas.InvoiceCreate):
    db_invoice = models.Invoice(**invoice.dict())
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

def get_invoices(db: Session) -> List[models.Invoice]:
    return db.query(models.Invoice).all()

def get_invoice(db: Session, invoice_id: uuid.UUID):
    return db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()

def update_invoice(db: Session, invoice_id: uuid.UUID, invoice_data: schemas.InvoiceCreate):
    db_invoice = get_invoice(db, invoice_id)
    if db_invoice:
        for key, value in invoice_data.dict(exclude_unset=True).items():
            setattr(db_invoice, key, value)
        db.commit()
        db.refresh(db_invoice)
    return db_invoice

def delete_invoice(db: Session, invoice_id: uuid.UUID):
    db_invoice = get_invoice(db, invoice_id)
    if db_invoice:
        db.delete(db_invoice)
        db.commit()
    return db_invoice


# ----------------------------
# Payments CRUD
# ----------------------------
def create_payment(db: Session, payment: schemas.PaymentCreate):
    db_payment = models.Payment(**payment.dict())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

def get_payments(db: Session) -> List[models.Payment]:
    return db.query(models.Payment).all()

def get_payment(db: Session, payment_id: uuid.UUID):
    return db.query(models.Payment).filter(models.Payment.id == payment_id).first()

def update_payment(db: Session, payment_id: uuid.UUID, payment_data: schemas.PaymentCreate):
    db_payment = get_payment(db, payment_id)
    if db_payment:
        for key, value in payment_data.dict(exclude_unset=True).items():
            setattr(db_payment, key, value)
        db.commit()
        db.refresh(db_payment)
    return db_payment

def delete_payment(db: Session, payment_id: uuid.UUID):
    db_payment = get_payment(db, payment_id)
    if db_payment:
        db.delete(db_payment)
        db.commit()
    return db_payment


# ----------------------------
# AuditLogs CRUD
# ----------------------------
def create_audit_log(db: Session, log: schemas.AuditLogCreate):
    db_log = models.AuditLog(**log.dict())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_audit_logs(db: Session) -> List[models.AuditLog]:
    return db.query(models.AuditLog).all()

def get_audit_log(db: Session, log_id: uuid.UUID):
    return db.query(models.AuditLog).filter(models.AuditLog.id == log_id).first()

def update_audit_log(db: Session, log_id: uuid.UUID, log_data: schemas.AuditLogCreate):
    db_log = get_audit_log(db, log_id)
    if db_log:
        for key, value in log_data.dict(exclude_unset=True).items():
            setattr(db_log, key, value)
        db.commit()
        db.refresh(db_log)
    return db_log

def delete_audit_log(db: Session, log_id: uuid.UUID):
    db_log = get_audit_log(db, log_id)
    if db_log:
        db.delete(db_log)
        db.commit()
    return db_log
