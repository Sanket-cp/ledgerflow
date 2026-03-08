import api from '@/lib/api';
import { Reminder } from '@/types';

export const reminderService = {
  async getAll(status?: string): Promise<Reminder[]> {
    const params = status ? { status } : {};
    const response = await api.get('/reminders', { params });
    return response.data.map((r: any) => ({
      ...r,
      id: r._id,
      customerId: r.customerId?._id || r.customerId,
    }));
  },

  async getById(id: string): Promise<Reminder> {
    const response = await api.get(`/reminders/${id}`);
    return {
      ...response.data,
      id: response.data._id,
      customerId: response.data.customerId?._id || response.data.customerId,
    };
  },

  async create(data: Omit<Reminder, 'id' | 'createdAt' | 'lastSent' | 'nextDue'>): Promise<Reminder> {
    const response = await api.post('/reminders', data);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  async update(id: string, data: Partial<Reminder>): Promise<Reminder> {
    const response = await api.put(`/reminders/${id}`, data);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/reminders/${id}`);
  },

  async markSent(id: string): Promise<Reminder> {
    const response = await api.patch(`/reminders/${id}/mark-sent`);
    return {
      ...response.data,
      id: response.data._id,
    };
  },

  async getPending(): Promise<Reminder[]> {
    const response = await api.get('/reminders/pending/check');
    return response.data.map((r: any) => ({
      ...r,
      id: r._id,
      customerId: r.customerId?._id || r.customerId,
    }));
  },

  async generateDaily(): Promise<{ paymentReminders: number; interestReminders: number; total: number }> {
    const response = await api.post('/reminders/generate/daily');
    return response.data;
  },

  async cleanup(): Promise<{ deletedCount: number }> {
    const response = await api.delete('/reminders/cleanup');
    return response.data;
  },
};
