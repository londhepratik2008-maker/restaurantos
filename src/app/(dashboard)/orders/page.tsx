"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Clock, CheckCircle, XCircle, ChefHat } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatTime } from "@/lib/utils";
import { useRestaurantStore } from "@/store/restaurant-store";
import { listOrders, listMenuItems, createOrder, updateOrder } from "@/lib/database";
import type { Order, OrderStatus, MenuItem } from "@/types";

export default function OrdersPage() {
  const { restaurant } = useRestaurantStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!restaurant) return;
    try {
      const [o, m] = await Promise.all([listOrders(restaurant.$id), listMenuItems(restaurant.$id)]);
      setOrders(o);
      setMenuItems(m);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [restaurant]);

  useEffect(() => { load(); }, [load]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer_name && order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      setOrders(orders.map((o) => (o.$id === orderId ? { ...o, status: newStatus } : o)));
    } catch (e) { console.error(e); }
  };

  const getStatusActions = (status: OrderStatus) => {
    const nextStatuses: Record<OrderStatus, OrderStatus | null> = {
      pending: "confirmed", confirmed: "preparing", preparing: "ready",
      ready: "completed", completed: null, cancelled: null,
    };
    return nextStatuses[status];
  };

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  const handleCreateOrder = async (data: {
    type: string; table_number: string; customer_name: string;
    customer_phone: string; notes: string; total: number;
  }) => {
    if (!restaurant) return;
    const orderNum = `ORD-${String(orders.length + 1).padStart(4, "0")}`;
    try {
      const order = await createOrder({
        restaurant_id: restaurant.$id,
        order_number: orderNum,
        type: data.type as Order["type"],
        status: "pending",
        table_number: data.table_number,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        subtotal: data.total,
        tax_amount: 0,
        discount_amount: 0,
        total: data.total,
        payment_status: "unpaid",
        payment_method: "cash",
        notes: data.notes,
        created_by: restaurant.owner_id,
      });
      setOrders([order, ...orders]);
      setIsDialogOpen(false);
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Order Management"
        description="Track and manage all orders in real-time"
        actions={
          <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />New Order
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(["pending", "confirmed", "preparing", "ready", "completed"] as const).map((status) => (
          <Card key={status} className={`cursor-pointer transition-all ${statusFilter === status ? "ring-2 ring-orange-500" : "hover:shadow-md"}`}
            onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{counts[status]}</p>
              <p className="text-xs text-gray-500 capitalize">{status}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search orders..." className="sm:max-w-xs" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredOrders.map((order) => {
          const nextStatus = getStatusActions(order.status);
          return (
            <Card key={order.$id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{order.order_number}</h3>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatTime(order.$createdAt)}</p>
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded capitalize">
                    {order.type.replace("_", " ")}
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  {order.table_number && <p className="text-sm text-gray-600">Table {order.table_number}</p>}
                  {order.customer_name && <p className="text-sm text-gray-600">{order.customer_name}</p>}
                  {order.notes && <p className="text-xs text-orange-600 italic">&quot;{order.notes}&quot;</p>}
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(order.total)}</p>
                  <StatusBadge status={order.payment_status} />
                </div>
                {nextStatus && (
                  <Button className="w-full mt-3 bg-orange-500 hover:bg-orange-600" size="sm"
                    onClick={() => updateOrderStatus(order.$id, nextStatus)}>
                    {nextStatus === "confirmed" && <CheckCircle className="w-4 h-4 mr-2" />}
                    {nextStatus === "preparing" && <ChefHat className="w-4 h-4 mr-2" />}
                    {nextStatus === "ready" && <Clock className="w-4 h-4 mr-2" />}
                    {nextStatus === "completed" && <CheckCircle className="w-4 h-4 mr-2" />}
                    Mark as {nextStatus.replace("_", " ")}
                  </Button>
                )}
                {order.status !== "completed" && order.status !== "cancelled" && (
                  <Button variant="outline" className="w-full mt-2 text-red-500 hover:text-red-600" size="sm"
                    onClick={() => updateOrderStatus(order.$id, "cancelled")}>
                    <XCircle className="w-4 h-4 mr-2" />Cancel Order
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
        {filteredOrders.length === 0 && (
          <Card className="col-span-full"><CardContent className="p-8 text-center text-gray-500">No orders found</CardContent></Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create New Order</DialogTitle></DialogHeader>
          <NewOrderForm menuItems={menuItems} onSubmit={handleCreateOrder} onCancel={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NewOrderForm({ menuItems, onSubmit, onCancel }: {
  menuItems: MenuItem[];
  onSubmit: (data: { type: string; table_number: string; customer_name: string; customer_phone: string; notes: string; total: number }) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState("dine_in");
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [total, setTotal] = useState(0);

  const handleItemSelect = (itemId: string) => {
    setSelectedItem(itemId);
    const item = menuItems.find((m) => m.$id === itemId);
    if (item) setTotal(item.price);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Order Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="dine_in">Dine In</SelectItem>
              <SelectItem value="takeaway">Takeaway</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Table Number</Label>
          <Input value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder="e.g., 5" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Customer Name</Label>
          <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Optional" />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Optional" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Add Items</Label>
        <Select value={selectedItem} onValueChange={handleItemSelect}>
          <SelectTrigger><SelectValue placeholder="Select menu item" /></SelectTrigger>
          <SelectContent>
            {menuItems.filter((i) => i.is_available).map((item) => (
              <SelectItem key={item.$id} value={item.$id}>
                {item.name} - {formatCurrency(item.price)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {total > 0 && <p className="text-sm text-gray-600">Total: <span className="font-bold">{formatCurrency(total)}</span></p>}
      <div className="space-y-2">
        <Label>Special Instructions</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special requests..." />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-orange-500 hover:bg-orange-600"
          onClick={() => onSubmit({ type, table_number: tableNumber, customer_name: customerName, customer_phone: customerPhone, notes, total })}>
          Create Order
        </Button>
      </DialogFooter>
    </div>
  );
}
