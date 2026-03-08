import { useApp } from '@/context/AppContext';
import { formatCurrency, getInitials } from '@/data/mockData';

export default function TopBorrowers() {
  const { customers } = useApp();
  const top = [...customers].filter(c => c.balance > 0).sort((a, b) => b.balance - a.balance).slice(0, 5);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-in" style={{ animationDelay: '350ms' }}>
      <h3 className="font-display font-semibold text-lg mb-4">Top Borrowers</h3>
      <div className="space-y-3">
        {top.map((c, i) => (
          <div key={c.id} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
              {getInitials(c.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{c.name}</p>
              <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.min(100, (c.balance / top[0].balance) * 100)}%` }}
                />
              </div>
            </div>
            <p className="text-sm font-semibold text-cash-out">{formatCurrency(c.balance)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
