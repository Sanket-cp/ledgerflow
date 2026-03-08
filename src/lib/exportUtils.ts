import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Customer, Transaction } from '@/types';
import { formatCurrency } from '@/data/mockData';

export function exportTransactionsPDF(transactions: Transaction[], title: string = 'Transaction Report') {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

  autoTable(doc, {
    startY: 36,
    head: [['Date', 'Customer', 'Type', 'Amount', 'Method', 'Purpose']],
    body: transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.customerName,
      t.type === 'given' ? 'Given' : 'Received',
      formatCurrency(t.amount),
      t.paymentMethod,
      t.purpose || '-',
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [34, 139, 113] },
  });

  doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
}

export function exportCustomerStatementPDF(customer: Customer, transactions: Transaction[]) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(`Statement: ${customer.name}`, 14, 22);
  doc.setFontSize(10);
  doc.text(`Phone: ${customer.phone}`, 14, 30);
  doc.text(`Address: ${customer.address}`, 14, 36);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 42);

  doc.setFontSize(11);
  doc.text(`Opening Balance: ${formatCurrency(customer.openingBalance)}`, 14, 52);
  doc.text(`Total Given: ${formatCurrency(customer.totalGiven)}`, 14, 58);
  doc.text(`Total Taken: ${formatCurrency(customer.totalTaken)}`, 14, 64);
  doc.text(`Current Balance: ${formatCurrency(customer.balance)}`, 14, 70);

  autoTable(doc, {
    startY: 78,
    head: [['Date', 'Type', 'Amount', 'Method', 'Purpose']],
    body: transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.type === 'given' ? 'Given' : 'Received',
      (t.type === 'given' ? '-' : '+') + formatCurrency(t.amount),
      t.paymentMethod,
      t.purpose || '-',
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [34, 139, 113] },
  });

  doc.save(`${customer.name.replace(/\s+/g, '_')}_Statement.pdf`);
}

export function exportTransactionsExcel(transactions: Transaction[], filename: string = 'transactions') {
  const headers = ['Date', 'Customer', 'Type', 'Amount', 'Method', 'Purpose'];
  const rows = transactions.map(t => [
    new Date(t.date).toLocaleDateString(),
    t.customerName,
    t.type,
    t.amount.toString(),
    t.paymentMethod,
    t.purpose || '',
  ]);

  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
