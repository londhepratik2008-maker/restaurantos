"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, AlertTriangle, Package } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { useRestaurantStore } from "@/store/restaurant-store";
import { listInventory, listSuppliers, createInventoryItem, updateInventoryItem, deleteInventoryItem, createSupplier, deleteSupplier } from "@/lib/database";
import { INVENTORY_CATEGORIES, INVENTORY_UNITS } from "@/lib/constants";
import type { InventoryItem, Supplier } from "@/types";

export default function InventoryPage() {
  const { restaurant } = useRestaurantStore();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!restaurant) return;
    try {
      const [i, s] = await Promise.all([listInventory(restaurant.$id), listSuppliers(restaurant.$id)]);
      setItems(i);
      setSuppliers(s);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [restaurant]);

  useEffect(() => { load(); }, [load]);

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const lowStockItems = items.filter((item) => item.quantity < item.min_stock_level);
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.cost_per_unit, 0);

  const handleDeleteItem = async (id: string) => {
    try { await deleteInventoryItem(id); setItems(items.filter((i) => i.$id !== id)); } catch (e) { console.error(e); }
  };
  const handleDeleteSupplier = async (id: string) => {
    try { await deleteSupplier(id); setSuppliers(suppliers.filter((s) => s.$id !== id)); } catch (e) { console.error(e); }
  };

  const handleAddItem = async (data: Record<string, string | number>) => {
    if (!restaurant) return;
    try {
      const item = await createInventoryItem({
        restaurant_id: restaurant.$id, name: data.name as string, category: data.category as string,
        quantity: Number(data.quantity), unit: data.unit as string, min_stock_level: Number(data.min_stock_level),
        cost_per_unit: Number(data.cost_per_unit), supplier_id: "", last_restocked: new Date().toISOString().slice(0, 10),
      });
      setItems([...items, item]);
      setIsItemDialogOpen(false);
    } catch (e) { console.error(e); }
  };

  const handleUpdateItem = async (data: Record<string, string | number>) => {
    if (!editingItem) return;
    try {
      const updated = await updateInventoryItem(editingItem.$id, {
        name: data.name as string, category: data.category as string,
        quantity: Number(data.quantity), unit: data.unit as string, min_stock_level: Number(data.min_stock_level),
        cost_per_unit: Number(data.cost_per_unit),
      });
      setItems(items.map((i) => i.$id === editingItem.$id ? updated : i));
      setEditingItem(null);
      setIsItemDialogOpen(false);
    } catch (e) { console.error(e); }
  };

  const handleAddSupplier = async (data: Record<string, string>) => {
    if (!restaurant) return;
    try {
      const sup = await createSupplier({
        restaurant_id: restaurant.$id, name: data.name, contact_person: data.contact_person,
        phone: data.phone, email: data.email, address: "", products: data.products ? data.products.split(",").map((p) => p.trim()) : [],
        is_active: true,
      });
      setSuppliers([...suppliers, sup]);
      setIsSupplierDialogOpen(false);
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Management" description="Track stock levels, suppliers, and costs"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsSupplierDialogOpen(true)}><Plus className="w-4 h-4 mr-2" />Supplier</Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setIsItemDialogOpen(true)}><Plus className="w-4 h-4 mr-2" />Add Item</Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-6"><div className="flex items-center gap-3"><div className="p-3 bg-blue-50 rounded-lg"><Package className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-500">Total Items</p><p className="text-2xl font-bold text-gray-900">{items.length}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center gap-3"><div className="p-3 bg-orange-50 rounded-lg"><AlertTriangle className="w-6 h-6 text-orange-600" /></div><div><p className="text-sm text-gray-500">Low Stock</p><p className="text-2xl font-bold text-orange-600">{lowStockItems.length}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center gap-3"><div className="p-3 bg-green-50 rounded-lg"><span className="text-2xl">&#x1F4B0;</span></div><div><p className="text-sm text-gray-500">Inventory Value</p><p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p></div></div></CardContent></Card>
      </div>

      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">Stock Items</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>
        <TabsContent value="stock" className="space-y-4">
          <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search inventory..." className="max-w-xs" />
          {filteredItems.length === 0 ? (
            <EmptyState title="No inventory items" description="Add your first inventory item" action={{ label: "Add Item", onClick: () => setIsItemDialogOpen(true) }} />
          ) : (
            <Card><CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Category</TableHead><TableHead>Stock</TableHead><TableHead>Min Level</TableHead><TableHead>Cost/Unit</TableHead><TableHead>Total Value</TableHead><TableHead>Status</TableHead><TableHead className="w-[80px]">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const isLow = item.quantity < item.min_stock_level;
                    return (
                      <TableRow key={item.$id} className={isLow ? "bg-red-50" : ""}>
                        <TableCell><p className="font-medium text-gray-900">{item.name}</p></TableCell>
                        <TableCell className="capitalize text-sm">{item.category.replace("_", " ")}</TableCell>
                        <TableCell><span className={`font-medium ${isLow ? "text-red-600" : ""}`}>{item.quantity} {item.unit}</span></TableCell>
                        <TableCell className="text-gray-500">{item.min_stock_level} {item.unit}</TableCell>
                        <TableCell>{formatCurrency(item.cost_per_unit)}</TableCell>
                        <TableCell>{formatCurrency(item.quantity * item.cost_per_unit)}</TableCell>
                        <TableCell>{isLow ? <StatusBadge status="pending" /> : <StatusBadge status="paid" />}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingItem(item); setIsItemDialogOpen(true); }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteItem(item.$id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="suppliers" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((supplier) => (
              <Card key={supplier.$id}><CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{supplier.name}</h3>
                    <p className="text-sm text-gray-500">{supplier.contact_person}</p>
                    <p className="text-xs text-gray-400 mt-1">{supplier.phone}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {supplier.products.map((p) => (<span key={p} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{p}</span>))}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteSupplier(supplier.$id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent></Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isItemDialogOpen} onOpenChange={(open) => { setIsItemDialogOpen(open); if (!open) setEditingItem(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingItem ? "Edit Inventory Item" : "Add Inventory Item"}</DialogTitle></DialogHeader>
          <ItemForm item={editingItem} onSubmit={editingItem ? handleUpdateItem : handleAddItem} onCancel={() => { setIsItemDialogOpen(false); setEditingItem(null); }} />
        </DialogContent>
      </Dialog>
      <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Supplier</DialogTitle></DialogHeader>
          <SupplierForm onSubmit={handleAddSupplier} onCancel={() => setIsSupplierDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ItemForm({ item, onSubmit, onCancel }: { item?: InventoryItem | null; onSubmit: (data: Record<string, string | number>) => void; onCancel: () => void }) {
  const [name, setName] = useState(item?.name || ""); const [category, setCategory] = useState(item?.category || ""); const [unit, setUnit] = useState(item?.unit || "");
  const [quantity, setQuantity] = useState(String(item?.quantity || "")); const [minStock, setMinStock] = useState(String(item?.min_stock_level || "")); const [cost, setCost] = useState(String(item?.cost_per_unit || ""));
  return (
    <div className="space-y-4">
      <div className="space-y-2"><Label>Item Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Salmon Fillets" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Category</Label><Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{INVENTORY_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c.replace("_", " ")}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-2"><Label>Unit</Label><Select value={unit} onValueChange={setUnit}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{INVENTORY_UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2"><Label>Quantity</Label><Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" /></div>
        <div className="space-y-2"><Label>Min Stock</Label><Input type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} placeholder="0" /></div>
        <div className="space-y-2"><Label>Cost/Unit</Label><Input type="number" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="0.00" /></div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => onSubmit({ name, category, unit, quantity: quantity || 0, min_stock_level: minStock || 0, cost_per_unit: cost || 0 })}>{item ? "Save Changes" : "Add Item"}</Button>
      </DialogFooter>
    </div>
  );
}

function SupplierForm({ onSubmit, onCancel }: { onSubmit: (data: Record<string, string>) => void; onCancel: () => void }) {
  const [name, setName] = useState(""); const [contact, setContact] = useState(""); const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); const [products, setProducts] = useState("");
  return (
    <div className="space-y-4">
      <div className="space-y-2"><Label>Supplier Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Fresh Meats Inc." /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Contact Person</Label><Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Name" /></div>
        <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" /></div>
      </div>
      <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="supplier@email.com" /></div>
      <div className="space-y-2"><Label>Products (comma separated)</Label><Input value={products} onChange={(e) => setProducts(e.target.value)} placeholder="e.g., beef, chicken, pork" /></div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => onSubmit({ name, contact_person: contact, phone, email, products })}>Add Supplier</Button>
      </DialogFooter>
    </div>
  );
}
