import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency, getInitials } from '@/data/mockData';
import { Plus, Search, Phone, MapPin, ToggleLeft, ToggleRight, Pencil, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AddCustomerDialog from '@/components/customers/AddCustomerDialog';
import CustomerQRCode from '@/components/CustomerQRCode';
import PageTransition from '@/components/PageTransition';
import EmptyState from '@/components/EmptyState';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Customer } from '@/types';

export default function CustomersPage() {
  const { customers, toggleCustomerStatus, loading } = useApp();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [qrCustomer, setQrCustomer] = useState<Customer | null>(null);

  if (loading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading customers...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  const filtered = customers
    .filter(c => filter === 'all' || (filter === 'active' ? c.isActive : !c.isActive))
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold">{t('customers')}</h1>
            <p className="text-muted-foreground mt-1">{customers.length} total customers</p>
          </div>
          <Button onClick={() => setShowDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" /> {t('addCustomer')}
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('search')} value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'inactive'] as const).map(f => (
              <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)} className="capitalize">
                {f}
              </Button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Users} title={t('noData')} description="No customers found. Add your first customer to get started." action={<Button onClick={() => setShowDialog(true)}>{t('addCustomer')}</Button>} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c, i) => (
              <div
                key={c.id}
                className={`rounded-xl border bg-card p-5 shadow-sm animate-fade-in transition-all hover:shadow-md ${!c.isActive ? 'opacity-60' : ''}`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                    {getInitials(c.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link to={`/customers/${c.id}`} className="font-semibold truncate hover:text-primary transition-colors">{c.name}</Link>
                      {!c.isActive && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">Inactive</span>}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Phone className="h-3 w-3" /> {c.phone}
                    </div>
                    {c.address && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {c.address}
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setQrCustomer(c)}>
                    <QrCode className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">{t('given')}</p>
                    <p className="text-sm font-semibold text-cash-out">{formatCurrency(c.totalGiven)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('received')}</p>
                    <p className="text-sm font-semibold text-cash-in">{formatCurrency(c.totalTaken)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('balance')}</p>
                    <p className={`text-sm font-semibold ${c.balance >= 0 ? 'text-cash-out' : 'text-cash-in'}`}>
                      {c.balance >= 0 ? '' : '-'}{formatCurrency(c.balance)}
                    </p>
                  </div>
                </div>

                {c.interestEnabled && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                    Interest: {c.interestRate}% {c.interestType}
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => toggleCustomerStatus(c.id)}>
                    {c.isActive ? <ToggleRight className="h-3.5 w-3.5 mr-1" /> : <ToggleLeft className="h-3.5 w-3.5 mr-1" />}
                    {c.isActive ? 'Disable' : 'Enable'}
                  </Button>
                  <Button variant="outline" size="sm" asChild className="flex-1 text-xs">
                    <Link to={`/customers/${c.id}`}>
                      <Pencil className="h-3.5 w-3.5 mr-1" /> View Ledger
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <AddCustomerDialog open={showDialog} onOpenChange={setShowDialog} />
        {qrCustomer && <CustomerQRCode customer={qrCustomer} open={!!qrCustomer} onOpenChange={(open) => !open && setQrCustomer(null)} />}
      </div>
    </PageTransition>
  );
}
