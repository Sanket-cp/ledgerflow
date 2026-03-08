import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/data/mockData';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function RecentTransactions() {
  const { transactions } = useApp();
  const recent = transactions.slice(0, 6);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in" style={{ animationDelay: '400ms' }}>
      <h3 className="font-display font-semibold text-lg mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {recent.map(tx => (
          <div key={tx.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tx.type === 'given' ? 'bg-cash-out/10' : 'bg-cash-in/10'}`}>
              {tx.type === 'given' ? <ArrowUpRight className="h-4 w-4 text-cash-out" /> : <ArrowDownLeft className="h-4 w-4 text-cash-in" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{tx.customerName}</p>
              <p className="text-xs text-muted-foreground truncate">{tx.purpose || 'No note'} · {tx.paymentMethod}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${tx.type === 'given' ? 'text-cash-out' : 'text-cash-in'}`}>
                {tx.type === 'given' ? '-' : '+'}{formatCurrency(tx.amount)}
              </p>
              <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
