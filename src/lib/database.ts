import { databases } from "@/lib/appwrite";
import { appwriteConfig } from "@/config/appwrite";
import { ID, Query } from "appwrite";
import type {
  Restaurant,
  Category,
  MenuItem,
  Order,
  OrderItem,
  InventoryItem,
  Supplier,
  Staff,
  Transaction,
  Customer,
} from "@/types";

const db = appwriteConfig.databaseId;
const col = appwriteConfig.collections;

// ─── Restaurants ────────────────────────────────────────
export async function getRestaurant(ownerId: string) {
  const res = await databases.listDocuments(db, col.restaurants, [
    Query.equal("owner_id", ownerId),
    Query.limit(1),
  ]);
  return (res.documents[0] as unknown as Restaurant) || null;
}

export async function createRestaurant(data: Omit<Restaurant, "$id" | "$createdAt" | "$updatedAt">) {
  const doc = await databases.createDocument(db, col.restaurants, ID.unique(), data);
  return doc as unknown as Restaurant;
}

export async function updateRestaurant(id: string, data: Partial<Restaurant>) {
  const doc = await databases.updateDocument(db, col.restaurants, id, data);
  return doc as unknown as Restaurant;
}

// ─── Categories ─────────────────────────────────────────
export async function listCategories(restaurantId: string) {
  const res = await databases.listDocuments(db, col.categories, [
    Query.equal("restaurant_id", restaurantId),
    Query.orderAsc("sort_order"),
  ]);
  return res.documents as unknown as Category[];
}

export async function createCategory(data: Omit<Category, "$id" | "$createdAt">) {
  const doc = await databases.createDocument(db, col.categories, ID.unique(), data);
  return doc as unknown as Category;
}

export async function updateCategory(id: string, data: Partial<Category>) {
  const doc = await databases.updateDocument(db, col.categories, id, data);
  return doc as unknown as Category;
}

export async function deleteCategory(id: string) {
  await databases.deleteDocument(db, col.categories, id);
}

// ─── Menu Items ─────────────────────────────────────────
export async function listMenuItems(restaurantId: string, categoryId?: string) {
  const queries = [Query.equal("restaurant_id", restaurantId)];
  if (categoryId) queries.push(Query.equal("category_id", categoryId));
  const res = await databases.listDocuments(db, col.menuItems, queries);
  return res.documents as unknown as MenuItem[];
}

export async function createMenuItem(data: Omit<MenuItem, "$id" | "$createdAt" | "$updatedAt">) {
  const doc = await databases.createDocument(db, col.menuItems, ID.unique(), data);
  return doc as unknown as MenuItem;
}

export async function updateMenuItem(id: string, data: Partial<MenuItem>) {
  const doc = await databases.updateDocument(db, col.menuItems, id, data);
  return doc as unknown as MenuItem;
}

export async function deleteMenuItem(id: string) {
  await databases.deleteDocument(db, col.menuItems, id);
}

// ─── Orders ─────────────────────────────────────────────
export async function listOrders(restaurantId: string, status?: string) {
  const queries = [
    Query.equal("restaurant_id", restaurantId),
    Query.orderDesc("$createdAt"),
    Query.limit(100),
  ];
  if (status) queries.push(Query.equal("status", status));
  const res = await databases.listDocuments(db, col.orders, queries);
  return res.documents as unknown as Order[];
}

export async function createOrder(data: Omit<Order, "$id" | "$createdAt" | "$updatedAt" | "items">) {
  const doc = await databases.createDocument(db, col.orders, ID.unique(), data);
  return doc as unknown as Order;
}

export async function updateOrder(id: string, data: Partial<Order>) {
  const doc = await databases.updateDocument(db, col.orders, id, data);
  return doc as unknown as Order;
}

export async function deleteOrder(id: string) {
  await databases.deleteDocument(db, col.orders, id);
}

// ─── Order Items ────────────────────────────────────────
export async function listOrderItems(orderId: string) {
  const res = await databases.listDocuments(db, col.orderItems, [
    Query.equal("order_id", orderId),
  ]);
  return res.documents as unknown as OrderItem[];
}

export async function createOrderItem(data: Omit<OrderItem, "$id" | "$createdAt">) {
  const doc = await databases.createDocument(db, col.orderItems, ID.unique(), data);
  return doc as unknown as OrderItem;
}

// ─── Inventory ──────────────────────────────────────────
export async function listInventory(restaurantId: string) {
  const res = await databases.listDocuments(db, col.inventoryItems, [
    Query.equal("restaurant_id", restaurantId),
  ]);
  return res.documents as unknown as InventoryItem[];
}

export async function createInventoryItem(data: Omit<InventoryItem, "$id" | "$createdAt" | "$updatedAt">) {
  const doc = await databases.createDocument(db, col.inventoryItems, ID.unique(), data);
  return doc as unknown as InventoryItem;
}

export async function updateInventoryItem(id: string, data: Partial<InventoryItem>) {
  const doc = await databases.updateDocument(db, col.inventoryItems, id, data);
  return doc as unknown as InventoryItem;
}

export async function deleteInventoryItem(id: string) {
  await databases.deleteDocument(db, col.inventoryItems, id);
}

// ─── Suppliers ──────────────────────────────────────────
export async function listSuppliers(restaurantId: string) {
  const res = await databases.listDocuments(db, col.suppliers, [
    Query.equal("restaurant_id", restaurantId),
  ]);
  return res.documents as unknown as Supplier[];
}

export async function createSupplier(data: Omit<Supplier, "$id" | "$createdAt">) {
  const doc = await databases.createDocument(db, col.suppliers, ID.unique(), data);
  return doc as unknown as Supplier;
}

export async function deleteSupplier(id: string) {
  await databases.deleteDocument(db, col.suppliers, id);
}

// ─── Staff ──────────────────────────────────────────────
export async function listStaff(restaurantId: string) {
  const res = await databases.listDocuments(db, col.staff, [
    Query.equal("restaurant_id", restaurantId),
  ]);
  return res.documents as unknown as Staff[];
}

export async function createStaff(data: Omit<Staff, "$id" | "$createdAt">) {
  const doc = await databases.createDocument(db, col.staff, ID.unique(), data);
  return doc as unknown as Staff;
}

export async function deleteStaff(id: string) {
  await databases.deleteDocument(db, col.staff, id);
}

// ─── Transactions ───────────────────────────────────────
export async function listTransactions(restaurantId: string, type?: string) {
  const queries = [
    Query.equal("restaurant_id", restaurantId),
    Query.orderDesc("$createdAt"),
  ];
  if (type) queries.push(Query.equal("type", type));
  const res = await databases.listDocuments(db, col.transactions, queries);
  return res.documents as unknown as Transaction[];
}

export async function createTransaction(data: Omit<Transaction, "$id" | "$createdAt">) {
  const doc = await databases.createDocument(db, col.transactions, ID.unique(), data);
  return doc as unknown as Transaction;
}

export async function updateTransaction(id: string, data: Partial<Transaction>) {
  const doc = await databases.updateDocument(db, col.transactions, id, data);
  return doc as unknown as Transaction;
}

export async function deleteTransaction(id: string) {
  await databases.deleteDocument(db, col.transactions, id);
}

// ─── Customers ──────────────────────────────────────────
export async function listCustomers(restaurantId: string) {
  const res = await databases.listDocuments(db, col.customers, [
    Query.equal("restaurant_id", restaurantId),
    Query.orderDesc("total_spent"),
  ]);
  return res.documents as unknown as Customer[];
}

export async function createCustomer(data: Omit<Customer, "$id" | "$createdAt">) {
  const doc = await databases.createDocument(db, col.customers, ID.unique(), data);
  return doc as unknown as Customer;
}

export async function updateCustomer(id: string, data: Partial<Customer>) {
  const doc = await databases.updateDocument(db, col.customers, id, data);
  return doc as unknown as Customer;
}

export async function deleteCustomer(id: string) {
  await databases.deleteDocument(db, col.customers, id);
}

// ─── Tables ──────────────────────────────────────────────
export async function listTables(restaurantId: string) {
  const res = await databases.listDocuments(db, col.tables, [
    Query.equal("restaurant_id", restaurantId),
    Query.orderAsc("number"),
  ]);
  return res.documents as unknown as import("@/types").Table[];
}

export async function createTable(data: Omit<import("@/types").Table, "$id" | "$createdAt">) {
  const doc = await databases.createDocument(db, col.tables, ID.unique(), data);
  return doc as unknown as import("@/types").Table;
}

export async function updateTable(id: string, data: Partial<import("@/types").Table>) {
  const doc = await databases.updateDocument(db, col.tables, id, data);
  return doc as unknown as import("@/types").Table;
}

export async function deleteTable(id: string) {
  await databases.deleteDocument(db, col.tables, id);
}

// ─── Staff Update ────────────────────────────────────────
export async function updateStaff(id: string, data: Partial<Staff>) {
  const doc = await databases.updateDocument(db, col.staff, id, data);
  return doc as unknown as Staff;
}

// ─── Restaurant Update ───────────────────────────────────
export async function updateRestaurantSettings(id: string, data: Partial<Restaurant>) {
  const doc = await databases.updateDocument(db, col.restaurants, id, data);
  return doc as unknown as Restaurant;
}
