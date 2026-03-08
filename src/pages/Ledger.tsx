import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency } from '@/data/mockData';
import { ArrowDownLeft, ArrowUpRight, Plus, Search, FileDown, FileSpreadsheet, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AddTransactionDialog from '@/components/ledger/AddTransactionDialog';
import PageTransition from '@/components/PageTransition';
import EmptyState from '@/components/EmptyState';
import { exportTransactionsPDF, exportTransactionsExcel } from '@/lib/exportUtils';
import { BookOpen } from 'lucide-react';

export default function LedgerPage() {
  const { transactions, deleteTransaction } = useApp();
  const { t } = useLanguage();
  const [showDialog, setShowDialog] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filtered = transactions
    .filter(t => typeFilter === 'all' || t.type === typeFilter)
    .filter(t => methodFilter === 'all' || t.paymentMethod === methodFilter)
    .filter(t => t.customerName.toLowerCase().includes(search.toLowerCase()) || t.purpose.toLowerCase().includes(search.toLowerCase()))
    .filter(t => !dateFrom || new Date(t.date) >= new Date(dateFrom))
    .filter(t => !dateTo || new Date(t.date) <= new Date(dateTo + 'T23:59:59'))
    .filter(t => !amountMin || t.amount >= Number(amountMin))
    .filter(t => !amountMax || t.amount <= Number(amountMax));

  const totalGiven = filtered.filter(t => t.type === 'given').reduce((s, t) => s + t.amount, 0);
  const totalTaken = filtered.filter(t => t.type === 'taken').reduce((s, t) => s + t.amount, 0);

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold">{t('ledger')}</h1>
            <p className="text-muted-foreground mt-1">All transactions across customers</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportTransactionsPDF(filtered, 'Ledger Report')} className="gap-1.5">
              <FileDown className="h-4 w-4" /> PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportTransactionsExcel(filtered)} className="gap-1.5">
              <FileSpreadsheet className="h-4 w-4" /> CSV
            </Button>
            <Button onClick={() => setShowDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" /> {t('newEntry')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border bg-card p-4 shadow-sm border-l-4 border-l-cash-out">
            <p className="text-sm text-muted-foreground">{t('given')}</p>
            <p className="text-xl font-display font-bold text-cash-out">{formatCurrency(totalGiven)}</p>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm border-l-4 border-l-cash-in">
            <p className="text-sm text-muted-foreground">{t('received')}</p>
            <p className="text-xl font-display font-bold text-cash-in">{formatCurrency(totalTaken)}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t('search')} value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px] shrink-0"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="given">{t('given')}</SelectItem>
                  <SelectItem value="taken">{t('received')}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-[140px] shrink-0"><SelectValue placeholder="Method" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)} className="gap-1.5 shrink-0">
                <Calendar className="h-4 w-4" /> Filters
              </Button>
            </div>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border bg-card p-4 animate-fade-in">
              <div><label className="text-xs text-muted-foreground">Date From</label><Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></div>
              <div><label className="text-xs text-muted-foreground">Date To</label><Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} /></div>
              <div><label className="text-xs text-muted-foreground">Min Amount</label><Input type="number" value={amountMin} onChange={e => setAmountMin(e.target.value)} placeholder="0" /></div>
              <div><label className="text-xs text-muted-foreground">Max Amount</label><Input type="number" value={amountMax} onChange={e => setAmountMax(e.target.value)} placeholder="∞" /></div>
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-card shadow-sm divide-y divide-border">
          {filtered.length === 0 ? (
            <EmptyState icon={BookOpen} title={t('noData')} description="No transactions match your filters. Try adjusting your search or add a new entry." action={<Button onClick={() => setShowDialog(true)}>Add Transaction</Button>} />
          ) : filtered.map((tx, i) => (
            <div key={tx.id} className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors animate-fade-in group" style={{ animationDelay: `${i * 30}ms` }}>
              <div className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${tx.type === 'given' ? 'bg-cash-out/10' : 'bg-cash-in/10'}`}>
                {tx.type === 'given' ? <ArrowUpRight className="h-4 w-4 text-cash-out" /> : <ArrowDownLeft className="h-4 w-4 text-cash-in" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{tx.customerName}</p>
                <p className="text-xs text-muted-foreground">{tx.purpose || 'No note'} · {tx.paymentMethod === 'upi' ? 'UPI' : tx.paymentMethod}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${tx.type === 'given' ? 'text-cash-out' : 'text-cash-in'}`}>
                  {tx.type === 'given' ? '-' : '+'}{formatCurrency(tx.amount)}
                </p>
                <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove this {formatCurrency(tx.amount)} {tx.type} entry for {tx.customerName} and reverse the balance.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteTransaction(tx.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {t('delete')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>

        <AddTransactionDialog open={showDialog} onOpenChange={setShowDialog} />
      </div>
    </PageTransition>
  );
}
