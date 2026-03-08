import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '@/context/AppContext';
import { useMemo } from 'react';

export default function CashFlowChart() {
  const { transactions } = useApp();

  // Process transactions to get monthly cash flow data
  const data = useMemo(() => {
    const monthlyData: Record<string, { name: string; cashIn: number; cashOut: number; month: number; year: number }> = {};
    
    // Get last 6 months
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyData[key] = {
        name: months[date.getMonth()],
        cashIn: 0,
        cashOut: 0,
        month: date.getMonth(),
        year: date.getFullYear(),
      };
    }
    
    // Aggregate transactions by month
    transactions.forEach(tx => {
      const txDate = new Date(tx.date || tx.createdAt);
      const key = `${txDate.getFullYear()}-${txDate.getMonth()}`;
      
      if (monthlyData[key]) {
        if (tx.type === 'taken') {
          monthlyData[key].cashIn += tx.amount;
        } else if (tx.type === 'given') {
          monthlyData[key].cashOut += tx.amount;
        }
      }
    });
    
    // Convert to array and sort by date
    return Object.values(monthlyData).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
  }, [transactions]);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
      <h3 className="font-display font-semibold text-lg mb-4">Cash Flow Overview</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '13px',
              }}
              formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
            />
            <Legend />
            <Bar dataKey="cashIn" name="Cash In" fill="hsl(var(--cash-in))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cashOut" name="Cash Out" fill="hsl(var(--cash-out))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
