import api from '@/lib/api';
import { Product } from '@/types';

export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await api.get('/products');
    return response.data.map((p: any) => ({
      ...p,
      id: p._id,
    }));
  },

  async getById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  async create(data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const response = await api.post('/products', data);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const response = await api.put(`/products/${id}`, data);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
