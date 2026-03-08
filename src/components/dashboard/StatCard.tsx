import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'cash-in' | 'cash-out' | 'warning';
  delay?: number;
}

export default function StatCard({ title, value, subtitle, icon: Icon, variant = 'default', delay = 0 }: StatCardProps) {
  const variantStyles = {
    default: 'bg-card border-border',
    'cash-in': 'bg-card border-l-4 border-l-cash-in border-t-border border-r-border border-b-border',
    'cash-out': 'bg-card border-l-4 border-l-cash-out border-t-border border-r-border border-b-border',
    warning: 'bg-card border-l-4 border-l-warning border-t-border border-r-border border-b-border',
  };

  const iconStyles = {
    default: 'bg-primary/10 text-primary',
    'cash-in': 'bg-cash-in/10 text-cash-in',
    'cash-out': 'bg-cash-out/10 text-cash-out',
    warning: 'bg-warning/10 text-warning',
  };

  return (
    <div
      className={`rounded-xl border p-5 shadow-sm animate-fade-in ${variantStyles[variant]}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-display font-bold tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconStyles[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
