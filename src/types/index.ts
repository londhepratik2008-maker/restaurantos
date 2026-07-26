export interface Restaurant {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  owner_id: string;
  address: string;
  phone: string;
  email: string;
  logo_url: string;
  currency: string;
  currency_symbol: string;
  tax_rate: number;
  service_charge_rate: number;
  subscription_plan: "starter" | "pro" | "enterprise";
  is_active: boolean;
  description: string;
  cuisine_type: string;
  website_url: string;
}

export interface Category {
  $id: string;
  $createdAt: string;
  restaurant_id: string;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

export interface MenuItem {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  cost_price: number;
  image_url: string;
  is_available: boolean;
  prep_time_minutes: number;
  tags: string[];
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type OrderType = "dine_in" | "takeaway" | "delivery";

export type PaymentStatus = "unpaid" | "paid" | "refunded" | "partial";

export type PaymentMethod = "cash" | "card" | "upi" | "online" | "bank_transfer";

export interface Order {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  restaurant_id: string;
  order_number: string;
  type: OrderType;
  status: OrderStatus;
  table_number: string;
  customer_name: string;
  customer_phone: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  notes: string;
  created_by: string;
  items: OrderItem[];
}

export interface OrderItem {
  $id: string;
  order_id: string;
  menu_item_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes: string;
}

export interface InventoryItem {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  restaurant_id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  min_stock_level: number;
  cost_per_unit: number;
  supplier_id: string;
  last_restocked: string;
}

export interface Supplier {
  $id: string;
  $createdAt: string;
  restaurant_id: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  products: string[];
  is_active: boolean;
}

export type StaffRole = "manager" | "waiter" | "kitchen" | "cashier";

export interface Staff {
  $id: string;
  $createdAt: string;
  restaurant_id: string;
  user_id: string;
  name: string;
  email: string;
  role: StaffRole;
  phone: string;
  pin: string;
  hourly_rate: number;
  permissions: string[];
  is_active: boolean;
  hire_date: string;
}

export type ShiftStatus = "scheduled" | "checked_in" | "completed" | "absent";

export interface Shift {
  $id: string;
  restaurant_id: string;
  staff_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: ShiftStatus;
}

export type TransactionType = "income" | "expense";

export interface Transaction {
  $id: string;
  $createdAt: string;
  restaurant_id: string;
  order_id: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  payment_method: PaymentMethod;
  recorded_by: string;
  transaction_date: string;
}

export interface Customer {
  $id: string;
  $createdAt: string;
  restaurant_id: string;
  name: string;
  phone: string;
  email: string;
  total_visits: number;
  total_spent: number;
  loyalty_points: number;
  last_visit: string;
  notes: string;
  tags: string[];
}

export type SubscriptionPlan = "starter" | "pro" | "enterprise";

export interface Table {
  $id: string;
  $createdAt: string;
  restaurant_id: string;
  number: number;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "cleaning";
  section: string;
  current_order_id: string;
}

export interface DashboardStats {
  todayRevenue: number;
  todayOrders: number;
  activeStaff: number;
  lowStockItems: number;
  revenueChange: number;
  ordersChange: number;
}

export interface DateRange {
  from: Date;
  to: Date;
}
