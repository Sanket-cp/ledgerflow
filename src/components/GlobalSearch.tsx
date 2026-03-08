import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/data/mockData';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Users, BookOpen, Search, Package } from 'lucide-react';

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const { customers, transactions, products } = useApp();
  const navigate = useNavigate();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setOpen(prev => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search...</span>
        <kbd className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono border border-border">⌘K</kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search customers, transactions, products..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Customers">
            {customers.slice(0, 5).map(c => (
              <CommandItem key={c.id} onSelect={() => { navigate(`/customers/${c.id}`); setOpen(false); }}>
                <Users className="mr-2 h-4 w-4" />
                <span>{c.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{formatCurrency(c.balance)}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Recent Transactions">
            {transactions.slice(0, 5).map(t => (
              <CommandItem key={t.id} onSelect={() => { navigate('/ledger'); setOpen(false); }}>
                <BookOpen className="mr-2 h-4 w-4" />
                <span>{t.customerName} - {t.purpose || t.type}</span>
                <span className={`ml-auto text-xs ${t.type === 'given' ? 'text-cash-out' : 'text-cash-in'}`}>{formatCurrency(t.amount)}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Products">
            {products.slice(0, 5).map(p => (
              <CommandItem key={p.id} onSelect={() => { navigate('/inventory'); setOpen(false); }}>
                <Package className="mr-2 h-4 w-4" />
                <span>{p.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">Stock: {p.stock}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
