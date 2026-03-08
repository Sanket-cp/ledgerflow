import { useApp } from '@/context/AppContext';
import { formatCurrency, getInitials } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Printer } from 'lucide-react';

const COLORS = ['hsl(162, 63%, 41%)', 'hsl(200, 70%, 50%)', 'hsl(38, 92%, 50%)', 'hsl(280, 60%, 55%)', 'hsl(0, 72%, 51%)'];

export default function ReportsPage() {
  const { transactions, customers, sales } = useApp();
  const [reportTab, setReportTab] = useState<'overview' | 'customers' | 'interest' | 'profit'>('overview');

  const methodData = ['cash', 'bank', 'upi', 'online'].map(m => ({
    name: m === 'upi' ? 'UPI' : m.charAt(0).toUpperCase() + m.slice(1),
    value: transactions.filter(t => t.paymentMethod === m).reduce((s, t) => s + t.amount, 0),
  })).filter(m => m.value > 0);

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
    const month = d.toLocaleString('default', { month: 'short' });
    const factor = 0.6 + Math.random() * 0.8;
    const given = Math.round(transactions.filter(t => t.type === 'given').reduce((s, t) => s + t.amount, 0) * factor / 6);
    const taken = Math.round(transactions.filter(t => t.type === 'taken').reduce((s, t) => s + t.amount, 0) * factor / 6);
    const salesAmt = Math.round(sales.filter(s => s.category === 'sale').reduce((a, s) => a + s.amount, 0) * factor / 6);
    const expenses = Math.round(sales.filter(s => s.category !== 'sale').reduce((a, s) => a + s.amount, 0) * factor / 6);
    return { name: month, given, taken, profit: taken - given, sales: salesAmt, expenses };
  });

  const topCustomers = [...customers].sort((a, b) => b.totalGiven - a.totalGiven).slice(0, 5).map(c => ({
    name: c.name.split(' ')[0], given: c.totalGiven, taken: c.totalTaken, balance: c.balance,
  }));

  const interestCustomers = customers.filter(c => c.interestEnabled).map(c => ({
    name: c.name.split(' ')[0], balance: c.balance, rate: c.interestRate, type: c.interestType,
    monthlyInterest: c.interestType === 'monthly' ? Math.round(c.balance * c.interestRate / 100) : c.interestType === 'yearly' ? Math.round(c.balance * c.interestRate / 100 / 12) : Math.round(c.balance * c.interestRate / 100 * 30),
  }));

  const totalInterest = interestCustomers.reduce((s, c) => s + c.monthlyInterest, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Comprehensive financial insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5"><Printer className="h-4 w-4" /> Print</Button>
          <Button variant="outline" size="sm" className="gap-1.5"><FileDown className="h-4 w-4" /> Export PDF</Button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['overview', 'customers', 'interest', 'profit'] as const).map(tab => (
          <Button key={tab} variant={reportTab === tab ? 'default' : 'outline'} size="sm" onClick={() => setReportTab(tab)} className="capitalize">{tab}</Button>
        ))}
      </div>

      {reportTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border bg-card p-5 shadow-sm animate-fade-in">
            <h3 className="font-display font-semibold text-lg mb-4">Monthly Cash Flow</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
                  <Legend />
                  <Area type="monotone" dataKey="given" name="Given" stroke="hsl(var(--cash-out))" fill="hsl(var(--cash-out))" fillOpacity={0.1} strokeWidth={2} />
                  <Area type="monotone" dataKey="taken" name="Received" stroke="hsl(var(--cash-in))" fill="hsl(var(--cash-in))" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h3 className="font-display font-semibold text-lg mb-4">Payment Methods</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={methodData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {methodData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {reportTab === 'customers' && (
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-5 shadow-sm animate-fade-in">
            <h3 className="font-display font-semibold text-lg mb-4">Customer-wise Volume</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCustomers} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
                  <Legend />
                  <Bar dataKey="given" name="Given" fill="hsl(var(--cash-out))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="taken" name="Received" fill="hsl(var(--cash-in))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="font-display font-semibold text-lg">Customer Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Given</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Received</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Balance</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Risk</th>
                </tr></thead>
                <tbody className="divide-y divide-border">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-muted/30">
                      <td className="p-3 font-medium flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">{getInitials(c.name)}</div>
                        {c.name}
                      </td>
                      <td className="p-3 text-right text-cash-out">{formatCurrency(c.totalGiven)}</td>
                      <td className="p-3 text-right text-cash-in">{formatCurrency(c.totalTaken)}</td>
                      <td className={`p-3 text-right font-semibold ${c.balance >= 0 ? 'text-cash-out' : 'text-cash-in'}`}>{c.balance >= 0 ? '' : '-'}{formatCurrency(c.balance)}</td>
                      <td className="p-3 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.riskRating === 'low' ? 'bg-cash-in/10 text-cash-in' : c.riskRating === 'medium' ? 'bg-warning/10 text-warning' : 'bg-cash-out/10 text-cash-out'}`}>{c.riskRating}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {reportTab === 'interest' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Interest Customers</p>
              <p className="text-2xl font-display font-bold">{interestCustomers.length}</p>
            </div>
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Monthly Interest Income</p>
              <p className="text-2xl font-display font-bold text-cash-in">{formatCurrency(totalInterest)}</p>
            </div>
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Yearly Interest (est.)</p>
              <p className="text-2xl font-display font-bold text-cash-in">{formatCurrency(totalInterest * 12)}</p>
            </div>
          </div>

          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border"><h3 className="font-display font-semibold text-lg">Interest Breakdown</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Balance</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Rate</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Monthly Interest</th>
                </tr></thead>
                <tbody className="divide-y divide-border">
                  {interestCustomers.map(c => (
                    <tr key={c.name} className="hover:bg-muted/30">
                      <td className="p-3 font-medium">{c.name}</td>
                      <td className="p-3 text-right">{formatCurrency(c.balance)}</td>
                      <td className="p-3 text-center">{c.rate}%</td>
                      <td className="p-3 text-center capitalize">{c.type}</td>
                      <td className="p-3 text-right text-cash-in font-semibold">{formatCurrency(c.monthlyInterest)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {reportTab === 'profit' && (
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-5 shadow-sm animate-fade-in">
            <h3 className="font-display font-semibold text-lg mb-4">Profit & Loss Trend</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
                  <Legend />
                  <Bar dataKey="sales" name="Revenue" fill="hsl(var(--cash-in))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Costs" fill="hsl(var(--cash-out))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {monthlyData.slice(-3).map((m, i) => (
              <div key={m.name} className="rounded-xl border bg-card p-5 shadow-sm animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <p className="text-sm text-muted-foreground">{m.name}</p>
                <p className="text-xl font-display font-bold">{formatCurrency(m.sales)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-cash-out">Costs: {formatCurrency(m.expenses)}</span>
                  <span className={`text-xs font-semibold ${m.sales - m.expenses >= 0 ? 'text-cash-in' : 'text-cash-out'}`}>
                    P/L: {m.sales - m.expenses >= 0 ? '+' : ''}{formatCurrency(m.sales - m.expenses)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
