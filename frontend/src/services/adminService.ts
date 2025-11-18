import api from './api';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalLessonsCompleted: number;
  totalMissionsCompleted: number;
  averageFinPoints: number;
  highestLevel: number;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  level: number;
  totalFinPoints: number;
  lastActivityDate: string | null;
  completedLessons: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getAllUsers = async (
  page: number = 0,
  size: number = 20,
  sort: string = 'name,asc'
): Promise<PageResponse<UserSummary>> => {
  const response = await api.get('/admin/users', {
    params: { page, size, sort }
  });
  return response.data;
};

export const promoteUserToAdmin = async (userId: string): Promise<void> => {
  await api.post(`/admin/users/${userId}/promote`);
};