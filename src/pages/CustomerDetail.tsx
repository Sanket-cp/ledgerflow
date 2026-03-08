import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatCurrency, getInitials } from '@/data/mockData';
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Phone, MapPin, Plus, QrCode, FileDown, Printer, Trash2, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AddTransactionDialog from '@/components/ledger/AddTransactionDialog';
import CustomerQRCode from '@/components/CustomerQRCode';
import EMICalculator from '@/components/EMICalculator';
import PageTransition from '@/components/PageTransition';
import { exportCustomerStatementPDF } from '@/lib/exportUtils';

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { customers, transactions, deleteTransaction } = useApp();
  const { t } = useLanguage();
  const [showTxDialog, setShowTxDialog] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showEMI, setShowEMI] = useState(false);

  const customer = customers.find(c => c.id === id);
  if (!customer) return <div className="p-8 text-center text-muted-foreground">Customer not found</div>;

  const customerTx = transactions.filter(t => t.customerId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <Link to="/customers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to {t('customers')}
        </Link>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
              {getInitials(customer.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-display font-bold">{customer.name}</h1>
              <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                {customer.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {customer.phone}</span>}
                {customer.address && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {customer.address}</span>}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowQR(true)} className="gap-1.5 flex-1 sm:flex-none">
                  <QrCode className="h-4 w-4" /> {t('qrCode')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowEMI(true)} className="gap-1.5 flex-1 sm:flex-none">
                  <Calculator className="h-4 w-4" /> EMI
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => exportCustomerStatementPDF(customer, customerTx)} className="gap-1.5 flex-1 sm:flex-none">
                  <FileDown className="h-4 w-4" /> PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 flex-1 sm:flex-none">
                  <Printer className="h-4 w-4" /> {t('print')}
                </Button>
              </div>
              <Button onClick={() => setShowTxDialog(true)} className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" /> Add Entry
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Opening Balance</p>
              <p className="text-lg font-semibold">{formatCurrency(customer.openingBalance)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('given')}</p>
              <p className="text-lg font-semibold text-cash-out">{formatCurrency(customer.totalGiven)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('received')}</p>
              <p className="text-lg font-semibold text-cash-in">{formatCurrency(customer.totalTaken)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('balance')}</p>
              <p className={`text-lg font-semibold ${customer.balance >= 0 ? 'text-cash-out' : 'text-cash-in'}`}>
                {customer.balance >= 0 ? '' : '-'}{formatCurrency(customer.balance)}
              </p>
            </div>
          </div>

          {customer.interestEnabled && (
            <div className="mt-4 p-3 rounded-lg bg-muted">
              <p className="text-sm"><span className="font-medium">Interest:</span> {customer.interestRate}% {customer.interestType}</p>
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-card shadow-sm">
          <div className="p-5 border-b border-border">
            <h2 className="font-display font-semibold text-lg">Transaction {t('ledger')}</h2>
          </div>
          <div className="divide-y divide-border">
            {customerTx.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">{t('noData')}</div>
            ) : customerTx.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors group">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${tx.type === 'given' ? 'bg-cash-out/10' : 'bg-cash-in/10'}`}>
                  {tx.type === 'given' ? <ArrowUpRight className="h-4 w-4 text-cash-out" /> : <ArrowDownLeft className="h-4 w-4 text-cash-in" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{tx.type === 'given' ? 'Money Given' : 'Money Received'}</p>
                  <p className="text-xs text-muted-foreground">{tx.purpose || 'No note'} · {tx.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${tx.type === 'given' ? 'text-cash-out' : 'text-cash-in'}`}>
                    {tx.type === 'given' ? '-' : '+'}{formatCurrency(tx.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
                        <AlertDialogDescription>This will remove this entry and reverse the balance impact.</AlertDialogDescription>
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
        </div>

        <AddTransactionDialog open={showTxDialog} onOpenChange={setShowTxDialog} preSelectedCustomerId={id} />
        <CustomerQRCode customer={customer} open={showQR} onOpenChange={setShowQR} />
        <EMICalculator open={showEMI} onOpenChange={setShowEMI} />
      </div>
    </PageTransition>
  );
}
