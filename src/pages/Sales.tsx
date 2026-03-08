import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/data/mockData';
import { Plus, ShoppingCart, TrendingDown, TrendingUp, DollarSign, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import StatCard from '@/components/dashboard/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(152, 60%, 42%)', 'hsl(0, 72%, 51%)', 'hsl(38, 92%, 50%)', 'hsl(200, 70%, 50%)'];

export default function SalesPage() {
  const { sales, addSaleEntry } = useApp();
  const [showDialog, setShowDialog] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<'sale' | 'expense' | 'purchase'>('sale');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'cash' | 'bank' | 'upi' | 'online'>('cash');

  const filtered = sales.filter(s => filter === 'all' || s.category === filter);

  const totalSales = sales.filter(s => s.category === 'sale').reduce((s, e) => s + e.amount, 0);
  const totalExpenses = sales.filter(s => s.category === 'expense').reduce((s, e) => s + e.amount, 0);
  const totalPurchases = sales.filter(s => s.category === 'purchase').reduce((s, e) => s + e.amount, 0);
  const profit = totalSales - totalExpenses - totalPurchases;

  const categoryData = [
    { name: 'Sales', value: totalSales },
    { name: 'Expenses', value: totalExpenses },
    { name: 'Purchases', value: totalPurchases },
  ];

  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - i * 86400000);
    const dateStr = date.toLocaleDateString('en-IN', { weekday: 'short' });
    const daySales = sales.filter(s => {
      const sd = new Date(s.date);
      return sd.toDateString() === date.toDateString();
    });
    return {
      name: dateStr,
      sales: daySales.filter(s => s.category === 'sale').reduce((a, s) => a + s.amount, 0),
      expenses: daySales.filter(s => s.category !== 'sale').reduce((a, s) => a + s.amount, 0),
    };
  }).reverse();

  const handleSubmit = () => {
    if (!desc.trim() || !amount) return;
    addSaleEntry({ date: new Date().toISOString(), description: desc.trim(), category, amount: Number(amount), paymentMethod: method });
    setShowDialog(false);
    setDesc(''); setAmount(''); setCategory('sale'); setMethod('cash');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Sales & Expenses</h1>
          <p className="text-muted-foreground mt-1">Track daily income, expenses and purchases</p>
        </div>
        <Button onClick={() => setShowDialog(true)} className="gap-2"><Plus className="h-4 w-4" /> New Entry</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Sales" value={formatCurrency(totalSales)} icon={TrendingUp} variant="cash-in" delay={0} />
        <StatCard title="Total Expenses" value={formatCurrency(totalExpenses)} icon={TrendingDown} variant="cash-out" delay={50} />
        <StatCard title="Purchases" value={formatCurrency(totalPurchases)} icon={ShoppingCart} delay={100} />
        <StatCard title="Net Profit" value={formatCurrency(profit)} icon={DollarSign} variant={profit >= 0 ? 'cash-in' : 'cash-out'} delay={150} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border bg-card p-5 shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h3 className="font-display font-semibold text-lg mb-4">Daily Overview (Last 7 Days)</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
                <Legend />
                <Bar dataKey="sales" name="Sales" fill="hsl(var(--cash-in))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--cash-out))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm animate-fade-in" style={{ animationDelay: '250ms' }}>
          <h3 className="font-display font-semibold text-lg mb-4">Breakdown</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entries</SelectItem>
            <SelectItem value="sale">Sales</SelectItem>
            <SelectItem value="expense">Expenses</SelectItem>
            <SelectItem value="purchase">Purchases</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-card shadow-sm divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No entries found</div>
        ) : filtered.map((entry, i) => (
          <div key={entry.id} className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
            <div className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${entry.category === 'sale' ? 'bg-cash-in/10' : 'bg-cash-out/10'}`}>
              {entry.category === 'sale' ? <ArrowDownLeft className="h-4 w-4 text-cash-in" /> : <ArrowUpRight className="h-4 w-4 text-cash-out" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{entry.description}</p>
              <p className="text-xs text-muted-foreground capitalize">{entry.category} · {entry.paymentMethod === 'upi' ? 'UPI' : entry.paymentMethod}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${entry.category === 'sale' ? 'text-cash-in' : 'text-cash-out'}`}>
                {entry.category === 'sale' ? '+' : '-'}{formatCurrency(entry.amount)}
              </p>
              <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-display">New Entry</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {(['sale', 'expense', 'purchase'] as const).map(c => (
                <Button key={c} variant={category === c ? 'default' : 'outline'} size="sm" onClick={() => setCategory(c)} className={`capitalize ${category === c && c === 'sale' ? 'bg-cash-in hover:bg-cash-in/90' : category === c ? 'bg-cash-out hover:bg-cash-out/90' : ''}`}>
                  {c}
                </Button>
              ))}
            </div>
            <div><Label>Description *</Label><Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="What was this for?" /></div>
            <div><Label>Amount (₹) *</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" /></div>
            <div>
              <Label>Payment Method</Label>
              <Select value={method} onValueChange={(v: any) => setMethod(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">💵 Cash</SelectItem>
                  <SelectItem value="bank">🏦 Bank Transfer</SelectItem>
                  <SelectItem value="upi">📱 UPI (GPay/PhonePe)</SelectItem>
                  <SelectItem value="online">🌐 Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSubmit} className="w-full">Save Entry</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
