"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Star, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRestaurantStore } from "@/store/restaurant-store";
import { listCustomers, createCustomer, updateCustomer, deleteCustomer } from "@/lib/database";
import type { Customer } from "@/types";

export default function CustomersPage() {
  const { restaurant } = useRestaurantStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!restaurant) return;
    try { setCustomers(await listCustomers(restaurant.$id)); } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [restaurant]);

  useEffect(() => { load(); }, [load]);

  const filteredCustomers = customers.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
  );

  const handleDelete = async (id: string) => {
    try { await deleteCustomer(id); setCustomers(customers.filter((c) => c.$id !== id)); } catch (e) { console.error(e); }
  };

  const handleAddCustomer = async (data: Record<string, string>) => {
    if (!restaurant) return;
    try {
      const cust = await createCustomer({
        restaurant_id: restaurant.$id, name: data.name, phone: data.phone, email: data.email || "",
        total_visits: 0, total_spent: 0, loyalty_points: 0, last_visit: new Date().toISOString().slice(0, 10),
        notes: "", tags: [],
      });
      setCustomers([...customers, cust]);
      setIsDialogOpen(false);
    } catch (e) { console.error(e); }
  };

  const handleUpdateCustomer = async (data: Record<string, string>) => {
    if (!editingCustomer) return;
    try {
      const updated = await updateCustomer(editingCustomer.$id, {
        name: data.name, phone: data.phone, email: data.email || "",
      });
      setCustomers(customers.map((c) => c.$id === editingCustomer.$id ? updated : c));
      setEditingCustomer(null);
      setIsDialogOpen(false);
    } catch (e) { console.error(e); }
  };

  const totalSpent = customers.reduce((sum, c) => sum + c.total_spent, 0);
  const totalPoints = customers.reduce((sum, c) => sum + c.loyalty_points, 0);

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Customer Management" description="Track customer visits, spending, and loyalty points"
        actions={<Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setIsDialogOpen(true)}><Plus className="w-4 h-4 mr-2" />Add Customer</Button>} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-6 text-center"><p className="text-3xl font-bold text-gray-900">{customers.length}</p><p className="text-sm text-gray-500">Total Customers</p></CardContent></Card>
        <Card><CardContent className="p-6 text-center"><p className="text-3xl font-bold text-green-600">{formatCurrency(totalSpent)}</p><p className="text-sm text-gray-500">Total Revenue</p></CardContent></Card>
        <Card><CardContent className="p-6 text-center"><p className="text-3xl font-bold text-orange-600">{totalPoints.toLocaleString()}</p><p className="text-sm text-gray-500">Loyalty Points</p></CardContent></Card>
      </div>

      <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search customers..." className="max-w-xs" />

      {filteredCustomers.length === 0 ? (
        <EmptyState title="No customers found" description="Add your first customer" action={{ label: "Add Customer", onClick: () => setIsDialogOpen(true) }} />
      ) : (
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Customer</TableHead><TableHead>Contact</TableHead><TableHead>Visits</TableHead>
              <TableHead>Total Spent</TableHead><TableHead>Loyalty Points</TableHead><TableHead>Last Visit</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.$id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-orange-600">{customer.name.split(" ").map((n) => n[0]).join("")}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.email || "No email"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">{customer.phone}</TableCell>
                  <TableCell>{customer.total_visits}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(customer.total_spent)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                      <span className="font-medium">{customer.loyalty_points}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">{formatDate(customer.last_visit)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingCustomer(customer); setIsDialogOpen(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(customer.$id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingCustomer(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingCustomer ? "Edit Customer" : "Add Customer"}</DialogTitle></DialogHeader>
          <CustomerForm customer={editingCustomer} onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer} onCancel={() => { setIsDialogOpen(false); setEditingCustomer(null); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CustomerForm({ customer, onSubmit, onCancel }: { customer?: Customer | null; onSubmit: (data: Record<string, string>) => void; onCancel: () => void }) {
  const [name, setName] = useState(customer?.name || ""); const [phone, setPhone] = useState(customer?.phone || ""); const [email, setEmail] = useState(customer?.email || "");
  return (
    <div className="space-y-4">
      <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer name" /></div>
      <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" /></div>
      <div className="space-y-2"><Label>Email (optional)</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" /></div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => name && onSubmit({ name, phone, email })}>{customer ? "Save Changes" : "Add Customer"}</Button>
      </DialogFooter>
    </div>
  );
}
