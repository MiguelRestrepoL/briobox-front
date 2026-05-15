import { http } from './client';
import type { User, UpdateUserPayload, ApiResponse } from '../types';

export const userApi = {
  getProfile: () =>
    http.get<{ success: boolean; user: User }>('/users/user'),

  updateProfile: (payload: UpdateUserPayload) =>
    http.put<User>('/users/user', payload),

  deleteAccount: () =>
    http.delete<ApiResponse>('/users/user'),
};