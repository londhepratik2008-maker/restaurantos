"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRestaurantStore } from "@/store/restaurant-store";
import { listTransactions, createTransaction, deleteTransaction } from "@/lib/database";
import { TRANSACTION_CATEGORIES } from "@/lib/constants";
import type { Transaction } from "@/types";

export default function BillingPage() {
  const { restaurant } = useRestaurantStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!restaurant) return;
    try { setTransactions(await listTransactions(restaurant.$id)); } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [restaurant]);

  useEffect(() => { load(); }, [load]);

  const filteredTransactions = typeFilter === "all" ? transactions : transactions.filter((t) => t.type === typeFilter);
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const handleAddTransaction = async (data: Record<string, string | number>) => {
    if (!restaurant) return;
    try {
      const txn = await createTransaction({
        restaurant_id: restaurant.$id, order_id: data.order_id as string || "", type: data.type as Transaction["type"],
        category: data.category as string, amount: Number(data.amount), description: data.description as string || "",
        payment_method: data.payment_method as Transaction["payment_method"],
        recorded_by: restaurant.owner_id, transaction_date: data.transaction_date as string,
      });
      setTransactions([txn, ...transactions]);
      setIsDialogOpen(false);
    } catch (e) { console.error(e); }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter((t) => t.$id !== id));
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Billing & Transactions" description="Track income, expenses, and financial health"
        actions={<Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setIsDialogOpen(true)}><Plus className="w-4 h-4 mr-2" />New Transaction</Button>} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-6"><div className="flex items-center gap-3"><div className="p-3 bg-green-50 rounded-lg"><TrendingUp className="w-6 h-6 text-green-600" /></div><div><p className="text-sm text-gray-500">Total Income</p><p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center gap-3"><div className="p-3 bg-red-50 rounded-lg"><TrendingDown className="w-6 h-6 text-red-600" /></div><div><p className="text-sm text-gray-500">Total Expenses</p><p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center gap-3"><div className="p-3 bg-blue-50 rounded-lg"><DollarSign className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-500">Net Profit</p><p className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>{formatCurrency(netProfit)}</p></div></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Transactions</CardTitle>
            <div className="flex gap-2">
              {["all", "income", "expense"].map((type) => (
                <Button key={type} variant={typeFilter === type ? "default" : "outline"} size="sm"
                  className={typeFilter === type ? "bg-orange-500 hover:bg-orange-600" : ""} onClick={() => setTypeFilter(type)}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Category</TableHead>
              <TableHead>Method</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="w-[50px]"></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filteredTransactions.map((txn) => (
                <TableRow key={txn.$id}>
                  <TableCell className="text-gray-500">{formatDate(txn.transaction_date)}</TableCell>
                  <TableCell><p className="font-medium text-gray-900">{txn.description}</p></TableCell>
                  <TableCell className="capitalize text-sm">{txn.category}</TableCell>
                  <TableCell className="capitalize text-sm">{txn.payment_method.replace("_", " ")}</TableCell>
                  <TableCell><StatusBadge status={txn.type === "income" ? "paid" : "pending"} /></TableCell>
                  <TableCell className="text-right">
                    <span className={`font-semibold ${txn.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {txn.type === "income" ? "+" : "-"}{formatCurrency(txn.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteTransaction(txn.$id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTransactions.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-gray-500 py-8">No transactions yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Transaction</DialogTitle></DialogHeader>
          <TransactionForm onSubmit={handleAddTransaction} onCancel={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TransactionForm({ onSubmit, onCancel }: { onSubmit: (data: Record<string, string | number>) => void; onCancel: () => void }) {
  const [type, setType] = useState("expense"); const [category, setCategory] = useState(""); const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash"); const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Type</Label><Select value={type} onValueChange={setType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="income">Income</SelectItem><SelectItem value="expense">Expense</SelectItem></SelectContent></Select></div>
        <div className="space-y-2"><Label>Category</Label><Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{TRANSACTION_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}</SelectContent></Select></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Amount</Label><Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" /></div>
        <div className="space-y-2"><Label>Payment Method</Label><Select value={method} onValueChange={setMethod}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="card">Card</SelectItem><SelectItem value="upi">UPI</SelectItem><SelectItem value="online">Online</SelectItem><SelectItem value="bank_transfer">Bank Transfer</SelectItem></SelectContent></Select></div>
      </div>
      <div className="space-y-2"><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
      <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Transaction notes..." /></div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-orange-500 hover:bg-orange-600"
          onClick={() => amount && category && onSubmit({ type, category, amount: parseFloat(amount), payment_method: method, transaction_date: date, description })}>
          Add Transaction
        </Button>
      </DialogFooter>
    </div>
  );
}
