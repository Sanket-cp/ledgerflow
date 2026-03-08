import api from '@/lib/api';
import { Customer } from '@/types';

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const response = await api.get('/customers');
    return response.data.map((c: any) => ({
      ...c,
      id: c._id,
    }));
  },

  async getById(id: string): Promise<Customer> {
    const response = await api.get(`/customers/${id}`);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  async create(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalGiven' | 'totalTaken' | 'balance'>): Promise<Customer> {
    const response = await api.post('/customers', data);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    const response = await api.put(`/customers/${id}`, data);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/customers/${id}`);
  },

  async toggleStatus(id: string): Promise<Customer> {
    const response = await api.patch(`/customers/${id}/toggle-status`);
    return {
      ...response.data,
      id: response.data._id,
    };
  },
};
