import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddCustomerDialog({ open, onOpenChange }: Props) {
  const { addCustomer } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [openingBalance, setOpeningBalance] = useState('0');
  const [creditLimit, setCreditLimit] = useState('50000');
  const [interestEnabled, setInterestEnabled] = useState(false);
  const [interestType, setInterestType] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [interestRate, setInterestRate] = useState('0');

  const handleSubmit = () => {
    if (!name.trim()) return;
    addCustomer({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      openingBalance: Number(openingBalance) || 0,
      creditLimit: Number(creditLimit) || 50000,
      riskRating: 'low',
      interestEnabled,
      interestType: interestEnabled ? interestType : 'none',
      interestRate: interestEnabled ? Number(interestRate) || 0 : 0,
      isActive: true,
    });
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setName(''); setPhone(''); setAddress(''); setOpeningBalance('0'); setCreditLimit('50000');
    setInterestEnabled(false); setInterestType('monthly'); setInterestRate('0');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Add New Customer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name *</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Customer name" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Phone</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91..." />
            </div>
            <div>
              <Label>Opening Balance</Label>
              <Input type="number" value={openingBalance} onChange={e => setOpeningBalance(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Address</Label>
            <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="City, State" />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <Label className="cursor-pointer">Enable Interest</Label>
            <Switch checked={interestEnabled} onCheckedChange={setInterestEnabled} />
          </div>
          {interestEnabled && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Interest Type</Label>
                <Select value={interestType} onValueChange={(v: any) => setInterestType(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Rate (%)</Label>
                <Input type="number" value={interestRate} onChange={e => setInterestRate(e.target.value)} />
              </div>
            </div>
          )}
          <Button onClick={handleSubmit} className="w-full">Add Customer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
