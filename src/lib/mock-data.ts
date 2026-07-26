import type {
  Restaurant,
  Category,
  MenuItem,
  Order,
  InventoryItem,
  Supplier,
  Staff,
  Transaction,
  Customer,
} from "@/types";

export const mockRestaurant: Restaurant = {
  $id: "rest-001",
  $createdAt: "2025-01-01T00:00:00Z",
  $updatedAt: "2025-01-01T00:00:00Z",
  name: "The Golden Fork",
  owner_id: "user-001",
  address: "123 Main Street, Foodville, CA 90210",
  phone: "+1 (555) 123-4567",
  email: "info@thegoldenfork.com",
  logo_url: "",
  currency: "USD",
  currency_symbol: "$",
  tax_rate: 8.5,
  service_charge_rate: 10,
  subscription_plan: "pro",
  is_active: true,
  description: "Fine dining restaurant",
  cuisine_type: "Italian",
  website_url: "https://thegoldenfork.com",
};

export const mockCategories: Category[] = [
  { $id: "cat-1", $createdAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", name: "Appetizers", description: "Start your meal right", sort_order: 1, is_active: true },
  { $id: "cat-2", $createdAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", name: "Main Course", description: "Hearty entrees", sort_order: 2, is_active: true },
  { $id: "cat-3", $createdAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", name: "Desserts", description: "Sweet endings", sort_order: 3, is_active: true },
  { $id: "cat-4", $createdAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", name: "Beverages", description: "Drinks & cocktails", sort_order: 4, is_active: true },
  { $id: "cat-5", $createdAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", name: "Pizza", description: "Wood-fired classics", sort_order: 5, is_active: true },
];

export const mockMenuItems: MenuItem[] = [
  { $id: "item-1", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", category_id: "cat-1", name: "Crispy Calamari", description: "Lightly fried squid with marinara sauce", price: 12.99, cost_price: 4.50, image_url: "", is_available: true, prep_time_minutes: 10, tags: ["seafood", "crispy"] },
  { $id: "item-2", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", category_id: "cat-1", name: "Bruschetta", description: "Toasted bread with fresh tomatoes and basil", price: 9.99, cost_price: 2.80, image_url: "", is_available: true, prep_time_minutes: 8, tags: ["vegetarian", "italian"] },
  { $id: "item-3", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", category_id: "cat-1", name: "Buffalo Wings", description: "Spicy chicken wings with blue cheese dip", price: 14.99, cost_price: 5.20, image_url: "", is_available: true, prep_time_minutes: 15, tags: ["spicy", "chicken"] },
  { $id: "item-4", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", category_id: "cat-2", name: "Grilled Salmon", description: "Atlantic salmon with lemon butter sauce", price: 24.99, cost_price: 9.80, image_url: "", is_available: true, prep_time_minutes: 20, tags: ["seafood", "healthy"] },
  { $id: "item-5", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", category_id: "cat-2", name: "Ribeye Steak", description: "12oz prime ribeye with garlic mashed potatoes", price: 34.99, cost_price: 14.50, image_url: "", is_available: true, prep_time_minutes: 25, tags: ["beef", "premium"] },
  { $id: "item-6", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", category_id: "cat-2", name: "Mushroom Risotto", description: "Creamy arborio rice with wild mushrooms", price: 18.99, cost_price: 5.60, image_url: "", is_available: true, prep_time_minutes: 18, tags: ["vegetarian", "italian"] },
  { $id: "item-7", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", category_id: "cat-2", name: "Chicken Parmesan", description: "Breaded chicken with marinara and melted mozzarella", price: 19.99, cost_price: 6.80, image_url: "", is_available: true, prep_time_minutes: 22, tags: ["chicken", "italian"] },
  { $id: "item-8", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", category_id: "cat-3", name: "Tiramisu", description: "Classic Italian coffee-flavored dessert", price: 9.99, cost_price: 2.50, image_url: "", is_available: true, prep_time_minutes: 5, tags: ["dessert", "coffee"] },
  { $id: "item-9", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", category_id: "cat-3", name: "Chocolate Lava Cake", description: "Warm chocolate cake with vanilla ice cream", price: 11.99, cost_price: 3.20, image_url: "", is_available: true, prep_time_minutes: 12, tags: ["dessert", "chocolate"] },
  { $id: "item-10", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", category_id: "cat-4", name: "Fresh Lemonade", description: "Freshly squeezed with mint", price: 4.99, cost_price: 0.80, image_url: "", is_available: true, prep_time_minutes: 3, tags: ["beverage", "non-alcoholic"] },
  { $id: "item-11", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", category_id: "cat-4", name: "Craft Beer", description: "Local IPA on tap", price: 7.99, cost_price: 2.50, image_url: "", is_available: true, prep_time_minutes: 2, tags: ["alcohol", "beer"] },
  { $id: "item-12", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", category_id: "cat-5", name: "Margherita Pizza", description: "Fresh mozzarella, tomato, and basil", price: 16.99, cost_price: 4.80, image_url: "", is_available: true, prep_time_minutes: 15, tags: ["pizza", "vegetarian"] },
  { $id: "item-13", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", category_id: "cat-5", name: "Pepperoni Pizza", description: "Classic pepperoni with mozzarella", price: 18.99, cost_price: 5.50, image_url: "", is_available: false, prep_time_minutes: 15, tags: ["pizza", "meat"] },
];

export const mockOrders: Order[] = [
  { $id: "ord-1", $createdAt: "2025-06-15T10:30:00Z", $updatedAt: "2025-06-15T10:30:00Z", restaurant_id: "rest-001", order_number: "ORD-0001", type: "dine_in", status: "completed", table_number: "5", customer_name: "John Smith", customer_phone: "", subtotal: 59.97, tax_amount: 5.10, discount_amount: 0, total: 65.07, payment_status: "paid", payment_method: "card", notes: "", created_by: "user-001", items: [] },
  { $id: "ord-2", $createdAt: "2025-06-15T11:15:00Z", $updatedAt: "2025-06-15T11:15:00Z", restaurant_id: "rest-001", order_number: "ORD-0002", type: "takeaway", status: "preparing", table_number: "", customer_name: "Sarah Johnson", customer_phone: "+1 555-234-5678", subtotal: 34.98, tax_amount: 2.97, discount_amount: 5, total: 32.95, payment_status: "unpaid", payment_method: "cash", notes: "Extra crispy wings", created_by: "user-001", items: [] },
  { $id: "ord-3", $createdAt: "2025-06-15T12:00:00Z", $updatedAt: "2025-06-15T12:00:00Z", restaurant_id: "rest-001", order_number: "ORD-0003", type: "dine_in", status: "pending", table_number: "12", customer_name: "Mike Davis", customer_phone: "", subtotal: 42.97, tax_amount: 3.65, discount_amount: 0, total: 46.62, payment_status: "unpaid", payment_method: "cash", notes: "", created_by: "user-001", items: [] },
  { $id: "ord-4", $createdAt: "2025-06-15T12:45:00Z", $updatedAt: "2025-06-15T12:45:00Z", restaurant_id: "rest-001", order_number: "ORD-0004", type: "delivery", status: "confirmed", table_number: "", customer_name: "Emily Brown", customer_phone: "+1 555-345-6789", subtotal: 28.98, tax_amount: 2.46, discount_amount: 0, total: 31.44, payment_status: "paid", payment_method: "online", notes: "Leave at door", created_by: "user-001", items: [] },
  { $id: "ord-5", $createdAt: "2025-06-15T13:30:00Z", $updatedAt: "2025-06-15T13:30:00Z", restaurant_id: "rest-001", order_number: "ORD-0005", type: "dine_in", status: "ready", table_number: "3", customer_name: "Alex Wilson", customer_phone: "", subtotal: 75.96, tax_amount: 6.46, discount_amount: 10, total: 72.42, payment_status: "unpaid", payment_method: "card", notes: "Birthday celebration", created_by: "user-001", items: [] },
  { $id: "ord-6", $createdAt: "2025-06-15T14:00:00Z", $updatedAt: "2025-06-15T14:00:00Z", restaurant_id: "rest-001", order_number: "ORD-0006", type: "takeaway", status: "completed", table_number: "", customer_name: "Lisa Chen", customer_phone: "+1 555-456-7890", subtotal: 22.98, tax_amount: 1.95, discount_amount: 0, total: 24.93, payment_status: "paid", payment_method: "upi", notes: "", created_by: "user-001", items: [] },
];

export const mockInventoryItems: InventoryItem[] = [
  { $id: "inv-1", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-06-15T00:00:00Z", restaurant_id: "rest-001", name: "Salmon Fillets", category: "meat", quantity: 15, unit: "pieces", min_stock_level: 20, cost_per_unit: 8.50, supplier_id: "sup-1", last_restocked: "2025-06-10" },
  { $id: "inv-2", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-06-15T00:00:00Z", restaurant_id: "rest-001", name: "Ribeye Steaks", category: "meat", quantity: 25, unit: "pieces", min_stock_level: 15, cost_per_unit: 12.00, supplier_id: "sup-1", last_restocked: "2025-06-12" },
  { $id: "inv-3", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-06-15T00:00:00Z", restaurant_id: "rest-001", name: "Mozzarella Cheese", category: "dairy", quantity: 5, unit: "kg", min_stock_level: 8, cost_per_unit: 6.50, supplier_id: "sup-2", last_restocked: "2025-06-08" },
  { $id: "inv-4", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-06-15T00:00:00Z", restaurant_id: "rest-001", name: "Fresh Basil", category: "produce", quantity: 2, unit: "kg", min_stock_level: 3, cost_per_unit: 4.00, supplier_id: "sup-3", last_restocked: "2025-06-14" },
  { $id: "inv-5", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-06-15T00:00:00Z", restaurant_id: "rest-001", name: "Tomatoes", category: "produce", quantity: 20, unit: "kg", min_stock_level: 10, cost_per_unit: 2.50, supplier_id: "sup-3", last_restocked: "2025-06-13" },
  { $id: "inv-6", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-06-15T00:00:00Z", restaurant_id: "rest-001", name: "All-Purpose Flour", category: "dry_goods", quantity: 50, unit: "kg", min_stock_level: 20, cost_per_unit: 0.80, supplier_id: "sup-2", last_restocked: "2025-06-01" },
  { $id: "inv-7", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-06-15T00:00:00Z", restaurant_id: "rest-001", name: "Olive Oil", category: "dry_goods", quantity: 10, unit: "liters", min_stock_level: 5, cost_per_unit: 12.00, supplier_id: "sup-2", last_restocked: "2025-06-05" },
  { $id: "inv-8", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-06-15T00:00:00Z", restaurant_id: "rest-001", name: "Craft Beer (IPA)", category: "beverages", quantity: 48, unit: "pieces", min_stock_level: 24, cost_per_unit: 2.50, supplier_id: "sup-4", last_restocked: "2025-06-11" },
  { $id: "inv-9", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-06-15T00:00:00Z", restaurant_id: "rest-001", name: "Chicken Breast", category: "meat", quantity: 30, unit: "pieces", min_stock_level: 20, cost_per_unit: 3.80, supplier_id: "sup-1", last_restocked: "2025-06-14" },
  { $id: "inv-10", $createdAt: "2025-01-01T00:00:00Z", $updatedAt: "2025-06-15T00:00:00Z", restaurant_id: "rest-001", name: "Heavy Cream", category: "dairy", quantity: 3, unit: "liters", min_stock_level: 5, cost_per_unit: 5.00, supplier_id: "sup-2", last_restocked: "2025-06-09" },
];

export const mockSuppliers: Supplier[] = [
  { $id: "sup-1", $createdAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", name: "Fresh Meat Co.", contact_person: "Robert Wilson", phone: "+1 555-111-2222", email: "orders@freshmeat.com", address: "456 Farm Road", products: ["beef", "chicken", "pork", "fish"], is_active: true },
  { $id: "sup-2", $createdAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", name: "Dairy Direct", contact_person: "Maria Garcia", phone: "+1 555-333-4444", email: "supply@dairydirect.com", address: "789 Dairy Lane", products: ["cheese", "milk", "cream", "butter"], is_active: true },
  { $id: "sup-3", $createdAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", name: "Green Valley Farms", contact_person: "Tom Anderson", phone: "+1 555-555-6666", email: "hello@greenvalley.com", address: "321 Farm Street", products: ["vegetables", "herbs", "fruits"], is_active: true },
  { $id: "sup-4", $createdAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", name: "Beverage Hub", contact_person: "Kevin Lee", phone: "+1 555-777-8888", email: "info@beveragehub.com", address: "654 Drink Ave", products: ["beer", "wine", "spirits", "soft drinks"], is_active: true },
];

export const mockStaff: Staff[] = [
  { $id: "staff-1", $createdAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", user_id: "user-001", name: "James Martinez", email: "james@email.com", role: "manager", phone: "+1 555-100-0001", pin: "1234", hourly_rate: 25, permissions: [], is_active: true, hire_date: "2024-01-15" },
  { $id: "staff-2", $createdAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", user_id: "user-002", name: "Emily Thompson", email: "emily@email.com", role: "waiter", phone: "+1 555-100-0002", pin: "5678", hourly_rate: 15, permissions: [], is_active: true, hire_date: "2024-03-20" },
  { $id: "staff-3", $createdAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", user_id: "user-003", name: "David Kim", email: "david@email.com", role: "kitchen", phone: "+1 555-100-0003", pin: "9012", hourly_rate: 18, permissions: [], is_active: true, hire_date: "2024-02-10" },
  { $id: "staff-4", $createdAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", user_id: "user-004", name: "Sarah Johnson", email: "sarah@email.com", role: "cashier", phone: "+1 555-100-0004", pin: "3456", hourly_rate: 14, permissions: [], is_active: true, hire_date: "2024-05-05" },
  { $id: "staff-5", $createdAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", user_id: "user-005", name: "Michael Brown", email: "michael@email.com", role: "waiter", phone: "+1 555-100-0005", pin: "7890", hourly_rate: 15, permissions: [], is_active: true, hire_date: "2024-06-01" },
  { $id: "staff-6", $createdAt: "2025-01-01T00:00:00Z", restaurant_id: "rest-001", user_id: "user-006", name: "Lisa Wang", email: "lisa@email.com", role: "kitchen", phone: "+1 555-100-0006", pin: "2345", hourly_rate: 18, permissions: [], is_active: true, hire_date: "2024-04-15" },
];

export const mockTransactions: Transaction[] = [
  { $id: "txn-1", $createdAt: "2025-06-15T10:30:00Z", restaurant_id: "rest-001", order_id: "ord-1", type: "income", category: "sales", amount: 65.07, description: "Order #ORD-0001", payment_method: "card", recorded_by: "user-001", transaction_date: "2025-06-15" },
  { $id: "txn-2", $createdAt: "2025-06-15T11:00:00Z", restaurant_id: "rest-001", order_id: "", type: "expense", category: "inventory", amount: 250.00, description: "Weekly produce order", payment_method: "bank_transfer", recorded_by: "user-001", transaction_date: "2025-06-15" },
  { $id: "txn-3", $createdAt: "2025-06-15T12:00:00Z", restaurant_id: "rest-001", order_id: "ord-4", type: "income", category: "sales", amount: 31.44, description: "Order #ORD-0004", payment_method: "online", recorded_by: "user-001", transaction_date: "2025-06-15" },
  { $id: "txn-4", $createdAt: "2025-06-15T14:00:00Z", restaurant_id: "rest-001", order_id: "ord-6", type: "income", category: "sales", amount: 24.93, description: "Order #ORD-0006", payment_method: "upi", recorded_by: "user-001", transaction_date: "2025-06-15" },
  { $id: "txn-5", $createdAt: "2025-06-15T16:00:00Z", restaurant_id: "rest-001", order_id: "", type: "expense", category: "salary", amount: 1200.00, description: "Staff payroll - Week 24", payment_method: "bank_transfer", recorded_by: "user-001", transaction_date: "2025-06-15" },
];

export const mockCustomers: Customer[] = [
  { $id: "cust-1", $createdAt: "2025-01-15T00:00:00Z", restaurant_id: "rest-001", name: "John Smith", phone: "+1 555-200-0001", email: "john@email.com", total_visits: 12, total_spent: 485.50, loyalty_points: 485, last_visit: "2025-06-15", notes: "", tags: ["regular"] },
  { $id: "cust-2", $createdAt: "2025-02-10T00:00:00Z", restaurant_id: "rest-001", name: "Sarah Johnson", phone: "+1 555-200-0002", email: "sarah@email.com", total_visits: 8, total_spent: 320.00, loyalty_points: 320, last_visit: "2025-06-14", notes: "", tags: [] },
  { $id: "cust-3", $createdAt: "2025-03-05T00:00:00Z", restaurant_id: "rest-001", name: "Mike Davis", phone: "+1 555-200-0003", email: "", total_visits: 15, total_spent: 612.75, loyalty_points: 612, last_visit: "2025-06-15", notes: "", tags: ["vip"] },
  { $id: "cust-4", $createdAt: "2025-04-20T00:00:00Z", restaurant_id: "rest-001", name: "Emily Brown", phone: "+1 555-200-0004", email: "emily@email.com", total_visits: 5, total_spent: 178.90, loyalty_points: 178, last_visit: "2025-06-13", notes: "", tags: [] },
  { $id: "cust-5", $createdAt: "2025-05-01T00:00:00Z", restaurant_id: "rest-001", name: "Alex Wilson", phone: "+1 555-200-0005", email: "alex@email.com", total_visits: 20, total_spent: 890.25, loyalty_points: 890, last_visit: "2025-06-15", notes: "", tags: ["vip", "regular"] },
  { $id: "cust-6", $createdAt: "2025-05-15T00:00:00Z", restaurant_id: "rest-001", name: "Lisa Chen", phone: "+1 555-200-0006", email: "lisa@email.com", total_visits: 3, total_spent: 95.80, loyalty_points: 95, last_visit: "2025-06-12", notes: "", tags: [] },
];

export const weeklyRevenueData = [
  { day: "Mon", revenue: 2450, orders: 42 },
  { day: "Tue", revenue: 1890, orders: 35 },
  { day: "Wed", revenue: 2780, orders: 48 },
  { day: "Thu", revenue: 3120, orders: 55 },
  { day: "Fri", revenue: 4560, orders: 78 },
  { day: "Sat", revenue: 5230, orders: 92 },
  { day: "Sun", revenue: 4890, orders: 85 },
];

export const monthlyRevenueData = [
  { month: "Jan", revenue: 42000, orders: 750 },
  { month: "Feb", revenue: 38000, orders: 680 },
  { month: "Mar", revenue: 45000, orders: 810 },
  { month: "Apr", revenue: 51000, orders: 920 },
  { month: "May", revenue: 48000, orders: 860 },
  { month: "Jun", revenue: 55000, orders: 980 },
];
