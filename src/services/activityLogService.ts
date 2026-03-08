import api from '@/lib/api';
import { ActivityLog } from '@/types';

export const activityLogService = {
  async getAll(limit = 50): Promise<ActivityLog[]> {
    const response = await api.get('/activity-logs', { params: { limit } });
    return response.data.map((log: any) => ({
      ...log,
      id: log._id,
      timestamp: log.createdAt,
    }));
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/activity-logs/${id}`);
  },

  async clearAll(): Promise<void> {
    await api.delete('/activity-logs');
  },
};
