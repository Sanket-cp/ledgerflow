export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  openingBalance: number;
  totalGiven: number;
  totalTaken: number;
  balance: number;
  interestEnabled: boolean;
  interestType: 'daily' | 'monthly' | 'yearly' | 'none';
  interestRate: number;
  creditLimit: number;
  riskRating: 'low' | 'medium' | 'high';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  type: 'given' | 'taken';
  amount: number;
  purpose: string;
  paymentMethod: PaymentMethod;
  date: string;
  attachment?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  minStock: number;
  unit: string;
  isActive: boolean;
  createdAt: string;
}

export interface SaleEntry {
  id: string;
  date: string;
  description: string;
  category: 'sale' | 'expense' | 'purchase';
  amount: number;
  paymentMethod: PaymentMethod;
  productId?: string;
  quantity?: number;
  createdAt: string;
}

export interface Reminder {
  id: string;
  customerId: string;
  customerName: string;
  type: 'payment_due' | 'interest_due' | 'custom';
  title: string;
  message: string;
  amount: number;
  dueDate: string;
  schedule: 'once' | 'daily' | 'weekly' | 'monthly';
  channel: 'browser' | 'sms' | 'whatsapp' | 'email';
  status: 'pending' | 'sent' | 'failed';
  isActive: boolean;
  lastSent?: string;
  nextDue?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user: string;
}

export type PaymentMethod = 'cash' | 'bank' | 'upi' | 'online';
export type TransactionType = 'given' | 'taken';
