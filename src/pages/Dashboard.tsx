import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency } from '@/data/mockData';
import { ArrowDownLeft, ArrowUpRight, TrendingUp, Users, AlertTriangle, Wallet, PiggyBank, Activity, Shield, Calculator } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import TopBorrowers from '@/components/dashboard/TopBorrowers';
import CashFlowChart from '@/components/dashboard/CashFlowChart';
import PageTransition from '@/components/PageTransition';
import EMICalculator from '@/components/EMICalculator';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function DashboardPage() {
  const { customers, transactions, sales, products, loading } = useApp();
  const { t } = useLanguage();
  const [showEMI, setShowEMI] = useState(false);

  if (loading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  const totalCashIn = transactions.filter(t => t.type === 'taken').reduce((s, t) => s + t.amount, 0);
  const totalCashOut = transactions.filter(t => t.type === 'given').reduce((s, t) => s + t.amount, 0);
  const totalDue = customers.reduce((s, c) => s + Math.max(0, c.balance), 0);
  const activeCustomers = customers.filter(c => c.isActive).length;
  const overdueCustomers = customers.filter(c => c.balance > 10000 && c.isActive).length;
  const interestEarned = customers.filter(c => c.interestEnabled).reduce((s, c) => s + (c.balance * c.interestRate / 100), 0);
  const totalSales = sales.filter(s => s.category === 'sale').reduce((a, s) => a + s.amount, 0);
  const totalExpenses = sales.filter(s => s.category !== 'sale').reduce((a, s) => a + s.amount, 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

  const collectionRate = totalCashOut > 0 ? Math.min(100, Math.round((totalCashIn / totalCashOut) * 100)) : 100;
  const healthScore = Math.min(100, Math.max(0, Math.round(
    (collectionRate * 0.4) +
    ((activeCustomers / Math.max(1, customers.length)) * 100 * 0.2) +
    (overdueCustomers === 0 ? 30 : Math.max(0, 30 - overdueCustomers * 5)) +
    (totalSales > totalExpenses ? 10 : 0)
  )));

  const healthColor = healthScore >= 75 ? 'text-cash-in' : healthScore >= 50 ? 'text-warning' : 'text-cash-out';

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold">{t('dashboard')}</h1>
              <p className="text-muted-foreground mt-1 text-sm">{t('overview')} of your financial activity</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowEMI(true)} className="gap-1.5 w-full sm:w-auto">
              <Calculator className="h-4 w-4" /> {t('emiCalculator')}
            </Button>
          </div>
          
          {/* Business Health Card - Separate row on mobile */}
          <div className="flex items-center gap-3 rounded-xl border bg-card p-3 sm:p-4 shadow-sm animate-fade-in w-full sm:w-auto sm:self-end">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">{t('businessHealth')}</p>
              <p className={`text-2xl sm:text-3xl font-display font-bold ${healthColor}`}>{healthScore}</p>
            </div>
            <div className="h-10 w-10 rounded-full border-4 border-muted flex items-center justify-center relative shrink-0">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none" stroke={healthScore >= 75 ? 'hsl(var(--cash-in))' : healthScore >= 50 ? 'hsl(var(--warning))' : 'hsl(var(--cash-out))'} strokeWidth="3" strokeDasharray={`${healthScore * 0.94} 94`} strokeLinecap="round" />
              </svg>
              <Activity className={`h-3.5 w-3.5 ${healthColor}`} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title={t('totalCashIn')} value={formatCurrency(totalCashIn)} icon={ArrowDownLeft} variant="cash-in" delay={0} />
          <StatCard title={t('totalCashOut')} value={formatCurrency(totalCashOut)} icon={ArrowUpRight} variant="cash-out" delay={50} />
          <StatCard title={t('totalDue')} value={formatCurrency(totalDue)} subtitle={`${overdueCustomers} overdue`} icon={Wallet} variant="warning" delay={100} />
          <StatCard title={t('activeCustomers')} value={String(activeCustomers)} subtitle={`${customers.length} total`} icon={Users} delay={150} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title={t('interestEarned')} value={formatCurrency(Math.round(interestEarned))} icon={TrendingUp} delay={200} />
          <StatCard title={t('totalSales')} value={formatCurrency(totalSales)} icon={PiggyBank} variant="cash-in" delay={250} />
          <StatCard title={t('totalExpenses')} value={formatCurrency(totalExpenses)} icon={ArrowUpRight} variant="cash-out" delay={300} />
          {lowStockCount > 0 && <StatCard title="Low Stock Alerts" value={String(lowStockCount)} icon={AlertTriangle} variant="warning" delay={350} />}
          {lowStockCount === 0 && <StatCard title="Net Balance" value={formatCurrency(totalCashOut - totalCashIn)} icon={Shield} delay={350} />}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CashFlowChart />
          </div>
          <TopBorrowers />
        </div>

        <RecentTransactions />
        <EMICalculator open={showEMI} onOpenChange={setShowEMI} />
      </div>
    </PageTransition>
  );
}
