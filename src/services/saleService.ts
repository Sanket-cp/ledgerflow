import api from '@/lib/api';
import { SaleEntry } from '@/types';

export const saleService = {
  async getAll(): Promise<SaleEntry[]> {
    const response = await api.get('/sales');
    return response.data.map((s: any) => ({
      ...s,
      id: s._id,
      productId: s.productId?._id || s.productId,
    }));
  },

  async getById(id: string): Promise<SaleEntry> {
    const response = await api.get(`/sales/${id}`);
    return {
      ...response.data,
      id: response.data._id,
      productId: response.data.productId?._id || response.data.productId,
    };
  },

  async create(data: Omit<SaleEntry, 'id' | 'createdAt'>): Promise<SaleEntry> {
    const response = await api.post('/sales', data);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  async update(id: string, data: Partial<SaleEntry>): Promise<SaleEntry> {
    const response = await api.put(`/sales/${id}`, data);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/sales/${id}`);
  },
};
