import api from '@/lib/api';
import { Transaction } from '@/types';

export const transactionService = {
  async getAll(customerId?: string): Promise<Transaction[]> {
    const params = customerId ? { customerId } : {};
    const response = await api.get('/transactions', { params });
    return response.data.map((t: any) => ({
      ...t,
      id: t._id,
      customerId: t.customerId._id || t.customerId,
    }));
  },

  async getById(id: string): Promise<Transaction> {
    const response = await api.get(`/transactions/${id}`);
    return {
      ...response.data,
      id: response.data._id,
      customerId: response.data.customerId._id || response.data.customerId,
    };
  },

  async create(data: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const response = await api.post('/transactions', data);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  async update(id: string, data: Partial<Transaction>): Promise<Transaction> {
    const response = await api.put(`/transactions/${id}`, data);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },
};
