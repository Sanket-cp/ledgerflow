import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/data/mockData';
import { Calculator } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EMICalculator({ open, onOpenChange }: Props) {
  const [principal, setPrincipal] = useState('50000');
  const [rate, setRate] = useState('2');
  const [tenure, setTenure] = useState('12');
  const [tenureType, setTenureType] = useState<'months' | 'years'>('months');

  const P = Number(principal) || 0;
  const annualRate = Number(rate) || 0;
  const monthlyRate = annualRate / 100 / 12;
  const months = tenureType === 'years' ? (Number(tenure) || 0) * 12 : (Number(tenure) || 0);

  // Calculate Monthly EMI using standard formula
  let monthlyEMI = 0;
  if (P > 0 && monthlyRate > 0 && months > 0) {
    // EMI = [P x R x (1+R)^N] / [(1+R)^N-1]
    const power = Math.pow(1 + monthlyRate, months);
    monthlyEMI = (P * monthlyRate * power) / (power - 1);
  } else if (P > 0 && months > 0) {
    // Simple division if no interest
    monthlyEMI = P / months;
  }

  const totalPayment = monthlyEMI * months;
  const totalInterest = totalPayment - P;

  // Calculate Daily EMI (monthly / 30 days)
  const dailyEMI = monthlyEMI / 30;

  // Calculate Weekly EMI (monthly * 12 months / 52 weeks)
  const weeklyEMI = (monthlyEMI * 12) / 52;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Calculator className="h-5 w-5" /> EMI Calculator
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Loan Amount (₹)</Label>
            <Input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} />
          </div>
          <div>
            <Label>Annual Interest Rate (%)</Label>
            <Input type="number" value={rate} onChange={e => setRate(e.target.value)} step="0.1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tenure</Label>
              <Input type="number" value={tenure} onChange={e => setTenure(e.target.value)} />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={tenureType} onValueChange={(v: any) => setTenureType(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="months">Months</SelectItem>
                  <SelectItem value="years">Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-xl border bg-muted/50 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Daily EMI</span>
              <span className="text-base font-display font-semibold text-blue-600">{formatCurrency(Math.round(dailyEMI))}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Weekly EMI</span>
              <span className="text-base font-display font-semibold text-purple-600">{formatCurrency(Math.round(weeklyEMI))}</span>
            </div>
            <div className="flex justify-between items-center border-t border-border pt-2">
              <span className="text-sm text-muted-foreground">Monthly EMI</span>
              <span className="text-lg font-display font-bold text-primary">{formatCurrency(Math.round(monthlyEMI))}</span>
            </div>
            <div className="border-t border-border pt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Interest</span>
                <span className="text-sm font-semibold text-cash-out">{formatCurrency(Math.round(totalInterest))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Payment</span>
                <span className="text-sm font-semibold">{formatCurrency(Math.round(totalPayment))}</span>
              </div>
            </div>

            {months > 0 && monthlyEMI > 0 && (
              <div className="mt-3">
                <div className="h-3 rounded-full bg-muted overflow-hidden flex">
                  <div className="bg-primary h-full rounded-l-full" style={{ width: `${(P / totalPayment) * 100}%` }} />
                  <div className="bg-cash-out h-full rounded-r-full" style={{ width: `${(totalInterest / totalPayment) * 100}%` }} />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                  <span>Principal ({Math.round((P / totalPayment) * 100)}%)</span>
                  <span>Interest ({Math.round((totalInterest / totalPayment) * 100)}%)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
