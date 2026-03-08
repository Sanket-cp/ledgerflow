import { Customer, Transaction, ActivityLog, Product, SaleEntry } from '@/types';

const d = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString();

export const mockCustomers: Customer[] = [
  { id: '1', name: 'Rajesh Kumar', phone: '+919876543210', address: 'Lajpat Nagar, Delhi', openingBalance: 5000, totalGiven: 45000, totalTaken: 32000, balance: 18000, interestEnabled: true, interestType: 'monthly', interestRate: 2, creditLimit: 100000, riskRating: 'low', isActive: true, createdAt: d(90), updatedAt: d(1) },
  { id: '2', name: 'Priya Sharma', phone: '+919123456789', address: 'Salt Lake, Kolkata', openingBalance: 0, totalGiven: 28000, totalTaken: 28000, balance: 0, interestEnabled: false, interestType: 'none', interestRate: 0, creditLimit: 50000, riskRating: 'low', isActive: true, createdAt: d(60), updatedAt: d(3) },
  { id: '3', name: 'Amit Patel', phone: '+919988776655', address: 'Navrangpura, Ahmedabad', openingBalance: 10000, totalGiven: 75000, totalTaken: 50000, balance: 35000, interestEnabled: true, interestType: 'monthly', interestRate: 3, creditLimit: 80000, riskRating: 'medium', isActive: true, createdAt: d(120), updatedAt: d(0) },
  { id: '4', name: 'Sunita Devi', phone: '+919812345678', address: 'Andheri West, Mumbai', openingBalance: 2000, totalGiven: 15000, totalTaken: 18000, balance: -1000, interestEnabled: false, interestType: 'none', interestRate: 0, creditLimit: 30000, riskRating: 'low', isActive: true, createdAt: d(45), updatedAt: d(7) },
  { id: '5', name: 'Vikram Singh', phone: '+919654321098', address: 'Civil Lines, Jaipur', openingBalance: 0, totalGiven: 60000, totalTaken: 25000, balance: 35000, interestEnabled: true, interestType: 'yearly', interestRate: 10, creditLimit: 50000, riskRating: 'high', isActive: false, createdAt: d(200), updatedAt: d(30) },
  { id: '6', name: 'Deepak Verma', phone: '+919567890123', address: 'Hazratganj, Lucknow', openingBalance: 3000, totalGiven: 22000, totalTaken: 10000, balance: 15000, interestEnabled: true, interestType: 'daily', interestRate: 0.1, creditLimit: 40000, riskRating: 'medium', isActive: true, createdAt: d(30), updatedAt: d(2) },
];

export const mockTransactions: Transaction[] = [
  { id: 't1', customerId: '1', customerName: 'Rajesh Kumar', type: 'given', amount: 15000, purpose: 'Business loan', paymentMethod: 'cash', date: d(1), createdAt: d(1) },
  { id: 't2', customerId: '1', customerName: 'Rajesh Kumar', type: 'taken', amount: 5000, purpose: 'Partial repayment', paymentMethod: 'bank', date: d(3), createdAt: d(3) },
  { id: 't3', customerId: '3', customerName: 'Amit Patel', type: 'given', amount: 25000, purpose: 'Shop renovation', paymentMethod: 'upi', date: d(0), createdAt: d(0) },
  { id: 't4', customerId: '2', customerName: 'Priya Sharma', type: 'taken', amount: 8000, purpose: 'Monthly settlement', paymentMethod: 'bank', date: d(2), createdAt: d(2) },
  { id: 't5', customerId: '4', customerName: 'Sunita Devi', type: 'taken', amount: 3000, purpose: 'Goods delivery payment', paymentMethod: 'cash', date: d(5), createdAt: d(5) },
  { id: 't6', customerId: '6', customerName: 'Deepak Verma', type: 'given', amount: 10000, purpose: 'Emergency loan', paymentMethod: 'cash', date: d(2), createdAt: d(2) },
  { id: 't7', customerId: '3', customerName: 'Amit Patel', type: 'taken', amount: 15000, purpose: 'Stock purchase return', paymentMethod: 'upi', date: d(7), createdAt: d(7) },
  { id: 't8', customerId: '1', customerName: 'Rajesh Kumar', type: 'given', amount: 8000, purpose: 'Additional loan', paymentMethod: 'cash', date: d(10), createdAt: d(10) },
];

export const mockProducts: Product[] = [
  { id: 'p1', name: 'Basmati Rice (25kg)', sku: 'GRC-001', category: 'Grocery', buyPrice: 1800, sellPrice: 2200, stock: 45, minStock: 10, unit: 'bag', isActive: true, createdAt: d(60) },
  { id: 'p2', name: 'Sugar (25kg)', sku: 'GRC-002', category: 'Grocery', buyPrice: 900, sellPrice: 1100, stock: 30, minStock: 8, unit: 'bag', isActive: true, createdAt: d(60) },
  { id: 'p3', name: 'Mustard Oil (5L)', sku: 'GRC-003', category: 'Grocery', buyPrice: 550, sellPrice: 680, stock: 5, minStock: 15, unit: 'bottle', isActive: true, createdAt: d(45) },
  { id: 'p4', name: 'Toor Dal (10kg)', sku: 'GRC-004', category: 'Grocery', buyPrice: 1200, sellPrice: 1450, stock: 22, minStock: 5, unit: 'bag', isActive: true, createdAt: d(40) },
  { id: 'p5', name: 'Tata Tea Gold (500g)', sku: 'BEV-001', category: 'Beverages', buyPrice: 280, sellPrice: 350, stock: 60, minStock: 20, unit: 'pack', isActive: true, createdAt: d(30) },
  { id: 'p6', name: 'Lifebuoy Soap', sku: 'HH-001', category: 'Household', buyPrice: 35, sellPrice: 48, stock: 120, minStock: 30, unit: 'piece', isActive: true, createdAt: d(25) },
];

export const mockSales: SaleEntry[] = [
  { id: 's1', date: d(0), description: 'Daily grocery sales', category: 'sale', amount: 12500, paymentMethod: 'cash', createdAt: d(0) },
  { id: 's2', date: d(0), description: 'Online orders (PhonePe)', category: 'sale', amount: 8200, paymentMethod: 'upi', createdAt: d(0) },
  { id: 's3', date: d(1), description: 'Grocery sales', category: 'sale', amount: 15000, paymentMethod: 'cash', createdAt: d(1) },
  { id: 's4', date: d(1), description: 'Shop rent', category: 'expense', amount: 15000, paymentMethod: 'bank', createdAt: d(1) },
  { id: 's5', date: d(2), description: 'Rice stock purchase', category: 'purchase', amount: 44000, paymentMethod: 'bank', productId: 'p1', quantity: 20, createdAt: d(2) },
  { id: 's6', date: d(2), description: 'Beverage sales', category: 'sale', amount: 6800, paymentMethod: 'cash', createdAt: d(2) },
  { id: 's7', date: d(3), description: 'Electricity bill', category: 'expense', amount: 3500, paymentMethod: 'upi', createdAt: d(3) },
  { id: 's8', date: d(3), description: 'Walk-in sales', category: 'sale', amount: 18000, paymentMethod: 'cash', createdAt: d(3) },
  { id: 's9', date: d(5), description: 'Sugar stock purchase', category: 'purchase', amount: 36000, paymentMethod: 'bank', productId: 'p2', quantity: 20, createdAt: d(5) },
  { id: 's10', date: d(7), description: 'Staff salary', category: 'expense', amount: 25000, paymentMethod: 'bank', createdAt: d(7) },
];

export const mockActivityLogs: ActivityLog[] = [
  { id: 'l1', action: 'Transaction Added', details: '₹15,000 given to Rajesh Kumar', timestamp: d(1), user: 'Admin' },
  { id: 'l2', action: 'Customer Added', details: 'New customer Deepak Verma added', timestamp: d(2), user: 'Admin' },
  { id: 'l3', action: 'Reminder Sent', details: 'Payment reminder sent to Amit Patel via WhatsApp', timestamp: d(3), user: 'System' },
  { id: 'l4', action: 'Interest Applied', details: 'Monthly interest ₹1,050 applied to Amit Patel', timestamp: d(5), user: 'System' },
  { id: 'l5', action: 'Customer Disabled', details: 'Vikram Singh account disabled', timestamp: d(30), user: 'Admin' },
  { id: 'l6', action: 'Product Added', details: 'Basmati Rice (25kg) added to inventory', timestamp: d(60), user: 'Admin' },
  { id: 'l7', action: 'Sale Recorded', details: '₹12,500 daily sales recorded', timestamp: d(0), user: 'Admin' },
  { id: 'l8', action: 'Low Stock Alert', details: 'Mustard Oil (5L) below minimum stock', timestamp: d(1), user: 'System' },
];

export function formatCurrency(amount: number): string {
  return '₹' + Math.abs(amount).toLocaleString('en-IN');
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
