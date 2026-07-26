import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const restaurantSchema = z.object({
  name: z.string().min(2, "Restaurant name is required"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  currency: z.string().default("USD"),
  tax_rate: z.number().min(0).max(100).default(0),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  description: z.string().optional(),
});

export const menuItemSchema = z.object({
  name: z.string().min(2, "Item name is required"),
  description: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  cost_price: z.number().min(0).optional(),
  prep_time_minutes: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
});

export const orderSchema = z.object({
  type: z.enum(["dine_in", "takeaway", "delivery"]),
  table_number: z.string().optional(),
  customer_name: z.string().optional(),
  customer_phone: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    menu_item_id: z.string(),
    name: z.string(),
    quantity: z.number().min(1),
    unit_price: z.number(),
  })).min(1, "Add at least one item"),
});

export const inventorySchema = z.object({
  name: z.string().min(2, "Item name is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.number().min(0),
  unit: z.string().min(1, "Unit is required"),
  min_stock_level: z.number().min(0),
  cost_per_unit: z.number().min(0),
  supplier_id: z.string().optional(),
});

export const supplierSchema = z.object({
  name: z.string().min(2, "Supplier name is required"),
  contact_person: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  products: z.array(z.string()).optional(),
});

export const staffSchema = z.object({
  name: z.string().min(2, "Staff name is required"),
  role: z.enum(["manager", "waiter", "kitchen", "cashier"]),
  phone: z.string().optional(),
  hourly_rate: z.number().min(0).optional(),
  hire_date: z.string().min(1, "Hire date is required"),
});

export const shiftSchema = z.object({
  staff_id: z.string().min(1, "Staff member is required"),
  date: z.string().min(1, "Date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
});

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().optional(),
  payment_method: z.enum(["cash", "card", "upi", "online"]),
  transaction_date: z.string().min(1, "Date is required"),
  order_id: z.string().optional(),
});

export const customerSchema = z.object({
  name: z.string().min(2, "Customer name is required"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type RestaurantFormData = z.infer<typeof restaurantSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type MenuItemFormData = z.infer<typeof menuItemSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type InventoryFormData = z.infer<typeof inventorySchema>;
export type SupplierFormData = z.infer<typeof supplierSchema>;
export type StaffFormData = z.infer<typeof staffSchema>;
export type ShiftFormData = z.infer<typeof shiftSchema>;
export type TransactionFormData = z.infer<typeof transactionSchema>;
export type CustomerFormData = z.infer<typeof customerSchema>;
