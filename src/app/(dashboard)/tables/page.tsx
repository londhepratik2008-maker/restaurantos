"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRestaurantStore } from "@/store/restaurant-store";
import { listTables, createTable, updateTable, deleteTable } from "@/lib/database";
import type { Table } from "@/types";

const statusConfig: Record<string, { bg: string; dot: string; label: string; text: string }> = {
  available: { bg: "bg-green-50 border-green-200 hover:bg-green-100", dot: "bg-green-500", label: "Available", text: "text-green-700" },
  occupied: { bg: "bg-red-50 border-red-200", dot: "bg-red-500", label: "Occupied", text: "text-red-700" },
  reserved: { bg: "bg-yellow-50 border-yellow-200", dot: "bg-yellow-500", label: "Reserved", text: "text-yellow-700" },
  cleaning: { bg: "bg-blue-50 border-blue-200", dot: "bg-blue-500", label: "Cleaning", text: "text-blue-700" },
};

export default function TablesPage() {
  const { restaurant } = useRestaurantStore();
  const [tables, setTables] = useState<Table[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!restaurant) return;
    try {
      setTables(await listTables(restaurant.$id));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [restaurant]);

  useEffect(() => { load(); }, [load]);

  const counts = {
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
    total: tables.length,
  };

  const handleAddTable = async (data: { number: number; capacity: number; section: string }) => {
    if (!restaurant) return;
    try {
      const table = await createTable({
        restaurant_id: restaurant.$id,
        number: data.number,
        capacity: data.capacity,
        status: "available",
        section: data.section,
        current_order_id: "",
      });
      setTables([...tables, table].sort((a, b) => a.number - b.number));
      setIsDialogOpen(false);
    } catch (e) { console.error(e); }
  };

  const handleToggleStatus = async (table: Table) => {
    const nextStatus: Table["status"] = table.status === "available" ? "occupied" : "available";
    try {
      await updateTable(table.$id, { status: nextStatus });
      setTables(tables.map((t) => t.$id === table.$id ? { ...t, status: nextStatus } : t));
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTable(id);
      setTables(tables.filter((t) => t.$id !== id));
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Table Management" description="Floor plan and table status overview"
        actions={
          <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />Add Table
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-gray-900">{counts.total}</p><p className="text-sm text-gray-500">Total Tables</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-green-600">{counts.available}</p><p className="text-sm text-gray-500">Available</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-red-600">{counts.occupied}</p><p className="text-sm text-gray-500">Occupied</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-yellow-600">{counts.reserved}</p><p className="text-sm text-gray-500">Reserved</p></CardContent></Card>
      </div>

      <div className="flex items-center gap-6 mb-2">
        {(["available", "occupied", "reserved", "cleaning"] as const).map((status) => (
          <div key={status} className="flex items-center gap-2">
            <div className={cn("w-3 h-3 rounded-full", statusConfig[status].dot)} />
            <span className="text-sm text-gray-600 capitalize">{status}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tables.map((table) => {
          const config = statusConfig[table.status] || statusConfig.available;
          return (
            <Card key={table.$id} className={cn("cursor-pointer transition-all border-2", config.bg)} onClick={() => handleToggleStatus(table)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">Table {table.number}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className={cn("w-2 h-2 rounded-full", config.dot)} />
                    <span className={cn("text-xs font-medium", config.text)}>{config.label}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={(e) => { e.stopPropagation(); handleDelete(table.$id); }}>
                      <Trash2 className="w-3 h-3 text-gray-400" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Seats {table.capacity} guests</p>
                {table.section && <p className="text-xs text-gray-400 mt-1">{table.section}</p>}
              </CardContent>
            </Card>
          );
        })}
        {tables.length === 0 && (
          <Card className="col-span-full"><CardContent className="p-8 text-center text-gray-500">No tables yet. Add your first table.</CardContent></Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Table</DialogTitle></DialogHeader>
          <TableForm onSubmit={handleAddTable} onCancel={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TableForm({ onSubmit, onCancel }: { onSubmit: (data: { number: number; capacity: number; section: string }) => void; onCancel: () => void }) {
  const [number, setNumber] = useState("");
  const [capacity, setCapacity] = useState("4");
  const [section, setSection] = useState("Main Hall");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Table Number</Label>
          <Input type="number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="1" />
        </div>
        <div className="space-y-2">
          <Label>Capacity</Label>
          <Input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="4" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Section</Label>
        <Select value={section} onValueChange={setSection}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Main Hall">Main Hall</SelectItem>
            <SelectItem value="Patio">Patio</SelectItem>
            <SelectItem value="Bar">Bar</SelectItem>
            <SelectItem value="Private">Private</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-orange-500 hover:bg-orange-600"
          onClick={() => number && onSubmit({ number: parseInt(number), capacity: parseInt(capacity) || 4, section })}>
          Add Table
        </Button>
      </DialogFooter>
    </div>
  );
}
