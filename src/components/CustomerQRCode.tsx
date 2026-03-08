import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Customer } from '@/types';
import { formatCurrency } from '@/data/mockData';
import { Download } from 'lucide-react';

interface Props {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CustomerQRCode({ customer, open, onOpenChange }: Props) {
  const qrData = JSON.stringify({
    name: customer.name,
    phone: customer.phone,
    balance: customer.balance,
    id: customer.id,
  });

  const handleDownload = () => {
    const svg = document.querySelector('#customer-qr svg') as SVGElement;
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([data], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${customer.name.replace(/\s+/g, '_')}_QR.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">Customer QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div id="customer-qr" className="rounded-xl border bg-white p-4">
            <QRCodeSVG value={qrData} size={200} level="H" />
          </div>
          <div className="text-center">
            <p className="font-semibold">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.phone}</p>
            <p className={`text-sm font-medium mt-1 ${customer.balance >= 0 ? 'text-cash-out' : 'text-cash-in'}`}>
              Balance: {formatCurrency(customer.balance)}
            </p>
          </div>
          <Button onClick={handleDownload} variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Download QR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
