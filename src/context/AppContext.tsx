import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, Transaction, ActivityLog, Product, SaleEntry, Reminder } from '@/types';
import { customerService } from '@/services/customerService';
import { transactionService } from '@/services/transactionService';
import { productService } from '@/services/productService';
import { saleService } from '@/services/saleService';
import { activityLogService } from '@/services/activityLogService';
import { reminderService } from '@/services/reminderService';
import { notificationService } from '@/services/notificationService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AppState {
  customers: Customer[];
  transactions: Transaction[];
  activityLogs: ActivityLog[];
  products: Product[];
  sales: SaleEntry[];
  reminders: Reminder[];
  loading: boolean;
  refreshData: () => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalGiven' | 'totalTaken' | 'balance'>) => Promise<void>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  toggleCustomerStatus: (id: string) => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addSaleEntry: (entry: Omit<SaleEntry, 'id' | 'createdAt'>) => Promise<void>;
  updateSaleEntry: (id: string, data: Partial<SaleEntry>) => Promise<void>;
  deleteSaleEntry: (id: string) => Promise<void>;
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'lastSent' | 'nextDue'>) => Promise<void>;
  updateReminder: (id: string, data: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  markReminderSent: (id: string) => Promise<void>;
  checkPendingReminders: () => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SaleEntry[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Fetch all data
  const refreshData = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const [customersData, transactionsData, productsData, salesData, logsData, remindersData] = await Promise.all([
        customerService.getAll(),
        transactionService.getAll(),
        productService.getAll(),
        saleService.getAll(),
        activityLogService.getAll(),
        reminderService.getAll(),
      ]);
      
      setCustomers(customersData);
      setTransactions(transactionsData);
      setProducts(productsData);
      setSales(salesData);
      setActivityLogs(logsData);
      setReminders(remindersData);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Check pending reminders periodically
  const checkPendingReminders = async () => {
    if (!isAuthenticated) return;
    
    try {
      const pending = await reminderService.getPending();
      
      // Track which reminders we've shown in this session
      const shownReminders = new Set<string>(
        JSON.parse(sessionStorage.getItem('shownReminders') || '[]')
      );
      
      for (const reminder of pending) {
        // Skip if already shown in this session
        if (shownReminders.has(reminder.id)) {
          continue;
        }
        
        if (reminder.channel === 'browser') {
          await notificationService.showNotification(reminder);
          
          // Mark as sent in backend
          await reminderService.markSent(reminder.id);
          
          // Track in session storage
          shownReminders.add(reminder.id);
          sessionStorage.setItem('shownReminders', JSON.stringify([...shownReminders]));
        }
      }
      
      // Refresh reminders list if any were sent
      if (pending.length > 0) {
        const updatedReminders = await reminderService.getAll();
        setReminders(updatedReminders);
      }
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  };

  // Generate daily reminders automatically
  const generateDailyReminders = async () => {
    if (!isAuthenticated) return;
    
    try {
      const result = await reminderService.generateDaily();
      console.log('Daily reminders generated:', result);
      
      // Refresh data
      await refreshData();
      
      // Check if any are due now
      await checkPendingReminders();
    } catch (error) {
      console.error('Error generating daily reminders:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
      
      // Request notification permission
      notificationService.requestPermission();
      
      // Generate daily reminders on first load
      generateDailyReminders();
      
      // Check reminders every 3 minutes (to avoid spam)
      const reminderInterval = setInterval(checkPendingReminders, 3 * 60 * 1000);
      
      // Generate daily reminders every 6 hours
      const dailyInterval = setInterval(generateDailyReminders, 6 * 60 * 60 * 1000);
      
      return () => {
        clearInterval(reminderInterval);
        clearInterval(dailyInterval);
      };
    }
  }, [isAuthenticated]);

  // Customer operations
  const addCustomer = async (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalGiven' | 'totalTaken' | 'balance'>) => {
    try {
      const newCustomer = await customerService.create(data);
      setCustomers(prev => [newCustomer, ...prev]);
      toast({ title: 'Success', description: 'Customer added successfully' });
      await refreshData(); // Refresh to get updated activity logs
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add customer',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateCustomer = async (id: string, data: Partial<Customer>) => {
    try {
      const updated = await customerService.update(id, data);
      setCustomers(prev => prev.map(c => c.id === id ? updated : c));
      toast({ title: 'Success', description: 'Customer updated successfully' });
      await refreshData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update customer',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await customerService.delete(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
      toast({ title: 'Success', description: 'Customer deleted successfully' });
      await refreshData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete customer',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const toggleCustomerStatus = async (id: string) => {
    try {
      const updated = await customerService.toggleStatus(id);
      setCustomers(prev => prev.map(c => c.id === id ? updated : c));
      toast({ title: 'Success', description: 'Customer status updated' });
      await refreshData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update status',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Transaction operations
  const addTransaction = async (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    try {
      const newTx = await transactionService.create(tx);
      setTransactions(prev => [newTx, ...prev]);
      toast({ title: 'Success', description: 'Transaction added successfully' });
      await refreshData(); // Refresh to update customer balances
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add transaction',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    try {
      const updated = await transactionService.update(id, data);
      setTransactions(prev => prev.map(t => t.id === id ? updated : t));
      toast({ title: 'Success', description: 'Transaction updated successfully' });
      await refreshData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update transaction',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionService.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({ title: 'Success', description: 'Transaction deleted successfully' });
      await refreshData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete transaction',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Product operations
  const addProduct = async (data: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      const newProduct = await productService.create(data);
      setProducts(prev => [newProduct, ...prev]);
      toast({ title: 'Success', description: 'Product added successfully' });
      await refreshData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add product',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    try {
      const updated = await productService.update(id, data);
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
      toast({ title: 'Success', description: 'Product updated successfully' });
      await refreshData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update product',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Success', description: 'Product deleted successfully' });
      await refreshData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete product',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Sale operations
  const addSaleEntry = async (data: Omit<SaleEntry, 'id' | 'createdAt'>) => {
    try {
      const newSale = await saleService.create(data);
      setSales(prev => [newSale, ...prev]);
      toast({ title: 'Success', description: 'Sale entry added successfully' });
      await refreshData(); // Refresh to update product stock
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add sale entry',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateSaleEntry = async (id: string, data: Partial<SaleEntry>) => {
    try {
      const updated = await saleService.update(id, data);
      setSales(prev => prev.map(s => s.id === id ? updated : s));
      toast({ title: 'Success', description: 'Sale entry updated successfully' });
      await refreshData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update sale entry',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteSaleEntry = async (id: string) => {
    try {
      await saleService.delete(id);
      setSales(prev => prev.filter(s => s.id !== id));
      toast({ title: 'Success', description: 'Sale entry deleted successfully' });
      await refreshData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete sale entry',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Reminder operations
  const addReminder = async (data: Omit<Reminder, 'id' | 'createdAt' | 'lastSent' | 'nextDue'>) => {
    try {
      const newReminder = await reminderService.create(data);
      setReminders(prev => [newReminder, ...prev]);
      toast({ title: 'Success', description: 'Reminder created successfully' });
      await refreshData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create reminder',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateReminder = async (id: string, data: Partial<Reminder>) => {
    try {
      const updated = await reminderService.update(id, data);
      setReminders(prev => prev.map(r => r.id === id ? updated : r));
      toast({ title: 'Success', description: 'Reminder updated successfully' });
      await refreshData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update reminder',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      await reminderService.delete(id);
      setReminders(prev => prev.filter(r => r.id !== id));
      toast({ title: 'Success', description: 'Reminder deleted successfully' });
      await refreshData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete reminder',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const markReminderSent = async (id: string) => {
    try {
      const updated = await reminderService.markSent(id);
      setReminders(prev => prev.map(r => r.id === id ? updated : r));
    } catch (error: any) {
      console.error('Error marking reminder as sent:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        customers,
        transactions,
        activityLogs,
        products,
        sales,
        reminders,
        loading,
        refreshData,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        toggleCustomerStatus,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addProduct,
        updateProduct,
        deleteProduct,
        addSaleEntry,
        updateSaleEntry,
        deleteSaleEntry,
        addReminder,
        updateReminder,
        deleteReminder,
        markReminderSent,
        checkPendingReminders,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
