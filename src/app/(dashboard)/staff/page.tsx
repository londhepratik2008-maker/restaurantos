"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
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
import { formatDate, formatCurrency } from "@/lib/utils";
import { useRestaurantStore } from "@/store/restaurant-store";
import { listStaff, createStaff, updateStaff, deleteStaff } from "@/lib/database";
import { STAFF_ROLES } from "@/lib/constants";
import type { Staff } from "@/types";

export default function StaffPage() {
  const { restaurant } = useRestaurantStore();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!restaurant) return;
    try { setStaffList(await listStaff(restaurant.$id)); } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [restaurant]);

  useEffect(() => { load(); }, [load]);

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || staff.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDeleteStaff = async (id: string) => {
    try { await deleteStaff(id); setStaffList(staffList.filter((s) => s.$id !== id)); } catch (e) { console.error(e); }
  };

  const handleAddStaff = async (data: Record<string, string | number>) => {
    if (!restaurant) return;
    try {
      const staff = await createStaff({
        restaurant_id: restaurant.$id, user_id: restaurant.owner_id,
        name: data.name as string, email: data.email as string || "", role: data.role as Staff["role"],
        phone: data.phone as string, pin: String(Math.floor(1000 + Math.random() * 9000)),
        hourly_rate: Number(data.hourly_rate) || 0, permissions: [], is_active: true,
        hire_date: data.hire_date as string || new Date().toISOString().slice(0, 10),
      });
      setStaffList([...staffList, staff]);
      setIsDialogOpen(false);
    } catch (e) { console.error(e); }
  };

  const handleUpdateStaff = async (data: Record<string, string | number>) => {
    if (!editingStaff) return;
    try {
      const updated = await updateStaff(editingStaff.$id, {
        name: data.name as string, email: data.email as string || "", role: data.role as Staff["role"],
        phone: data.phone as string, hourly_rate: Number(data.hourly_rate) || 0,
        hire_date: data.hire_date as string || editingStaff.hire_date,
      });
      setStaffList(staffList.map((s) => s.$id === editingStaff.$id ? updated : s));
      setEditingStaff(null);
      setIsDialogOpen(false);
    } catch (e) { console.error(e); }
  };

  const roleCounts = {
    all: staffList.length,
    manager: staffList.filter((s) => s.role === "manager").length,
    waiter: staffList.filter((s) => s.role === "waiter").length,
    kitchen: staffList.filter((s) => s.role === "kitchen").length,
    cashier: staffList.filter((s) => s.role === "cashier").length,
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Staff Management" description="Manage your team members and roles"
        actions={<Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setIsDialogOpen(true)}><Plus className="w-4 h-4 mr-2" />Add Staff</Button>} />

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(["all", "manager", "waiter", "kitchen", "cashier"] as const).map((role) => (
          <Card key={role} className={`cursor-pointer transition-all ${roleFilter === role ? "ring-2 ring-orange-500" : "hover:shadow-md"}`}
            onClick={() => setRoleFilter(roleFilter === role ? "all" : role)}>
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{roleCounts[role]}</p>
              <p className="text-xs text-gray-500 capitalize">{role === "all" ? "Total" : role}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search staff..." className="sm:max-w-xs" />

      {filteredStaff.length === 0 ? (
        <EmptyState title="No staff members found" description="Add your first team member" action={{ label: "Add Staff", onClick: () => setIsDialogOpen(true) }} />
      ) : (
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Staff Member</TableHead><TableHead>Role</TableHead><TableHead>Phone</TableHead>
              <TableHead>Hourly Rate</TableHead><TableHead>Hire Date</TableHead><TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filteredStaff.map((staff) => (
                <TableRow key={staff.$id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-orange-600">{staff.name.split(" ").map((n) => n[0]).join("")}</span>
                      </div>
                      <div><p className="font-medium text-gray-900">{staff.name}</p></div>
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge status={staff.role} /></TableCell>
                  <TableCell className="text-gray-500">{staff.phone}</TableCell>
                  <TableCell>{staff.hourly_rate ? formatCurrency(staff.hourly_rate) : "—"}</TableCell>
                  <TableCell className="text-gray-500">{formatDate(staff.hire_date)}</TableCell>
                  <TableCell><StatusBadge status={staff.is_active ? "checked_in" : "absent"} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingStaff(staff); setIsDialogOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteStaff(staff.$id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingStaff(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingStaff ? "Edit Staff Member" : "Add Staff Member"}</DialogTitle></DialogHeader>
          <StaffForm staff={editingStaff} onSubmit={editingStaff ? handleUpdateStaff : handleAddStaff} onCancel={() => { setIsDialogOpen(false); setEditingStaff(null); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StaffForm({ staff, onSubmit, onCancel }: { staff?: Staff | null; onSubmit: (data: Record<string, string | number>) => void; onCancel: () => void }) {
  const [name, setName] = useState(staff?.name || ""); const [role, setRole] = useState(staff?.role || ""); const [phone, setPhone] = useState(staff?.phone || "");
  const [email, setEmail] = useState(staff?.email || ""); const [rate, setRate] = useState(String(staff?.hourly_rate || "")); const [hireDate, setHireDate] = useState(staff?.hire_date || "");
  return (
    <div className="space-y-4">
      <div className="space-y-2"><Label>Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., John Smith" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Role</Label><Select value={role} onValueChange={setRole}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{STAFF_ROLES.map((r) => <SelectItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" /></div>
      </div>
      <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" /></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Hourly Rate</Label><Input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="0.00" /></div>
        <div className="space-y-2"><Label>Hire Date</Label><Input type="date" value={hireDate} onChange={(e) => setHireDate(e.target.value)} /></div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-orange-500 hover:bg-orange-600"
          onClick={() => name && role && onSubmit({ name, role, phone, email, hourly_rate: rate || 0, hire_date: hireDate })}>
          {staff ? "Save Changes" : "Add Staff"}
        </Button>
      </DialogFooter>
    </div>
  );
}
