import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preSelectedCustomerId?: string;
}

export default function AddTransactionDialog({ open, onOpenChange, preSelectedCustomerId }: Props) {
  const { customers, addTransaction } = useApp();
  const activeCustomers = customers.filter(c => c.isActive);

  const [customerId, setCustomerId] = useState(preSelectedCustomerId || '');
  const [type, setType] = useState<'given' | 'taken'>('given');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank' | 'upi' | 'online'>('cash');

  const handleSubmit = () => {
    const cId = preSelectedCustomerId || customerId;
    if (!cId || !amount) return;
    const customer = customers.find(c => c.id === cId);
    if (!customer) return;
    
    addTransaction({
      customerId: cId,
      customerName: customer.name,
      type,
      amount: Number(amount),
      purpose: purpose.trim(),
      paymentMethod,
      date: new Date().toISOString(),
    });
    onOpenChange(false);
    setAmount(''); setPurpose(''); setType('given'); setPaymentMethod('cash');
    if (!preSelectedCustomerId) setCustomerId('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">New Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!preSelectedCustomerId && (
            <div>
              <Label>Customer *</Label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>
                  {activeCustomers.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={type === 'given' ? 'default' : 'outline'}
              className={type === 'given' ? 'bg-cash-out hover:bg-cash-out/90' : ''}
              onClick={() => setType('given')}
            >
              💸 Given
            </Button>
            <Button
              type="button"
              variant={type === 'taken' ? 'default' : 'outline'}
              className={type === 'taken' ? 'bg-cash-in hover:bg-cash-in/90' : ''}
              onClick={() => setType('taken')}
            >
              💰 Received
            </Button>
          </div>

          <div>
            <Label>Amount (₹) *</Label>
            <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" className="text-lg" />
          </div>

          <div>
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">💵 Cash</SelectItem>
                <SelectItem value="bank">🏦 Bank Transfer</SelectItem>
                <SelectItem value="upi">📱 UPI (GPay/PhonePe)</SelectItem>
                <SelectItem value="online">🌐 Online</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Purpose / Note</Label>
            <Textarea value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="Optional note..." rows={2} />
          </div>

          <Button onClick={handleSubmit} className="w-full">Save Transaction</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
