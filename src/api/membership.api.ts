import { http } from './client';

export interface Membership {
  id: string;
  customer_id: string;
  plan_id: string;
  status: 'activa' | 'cancelada' | 'pendiente';
  start_date: string;
  end_date: string;
}

export interface CreateMembershipPayload {
  customerId: string;
  planId: string;
}

export const membershipApi = {
  create: (payload: CreateMembershipPayload) =>
    http.post<{ success: boolean; membership: Membership }>('/memberships', payload),

  getAll: () =>
    http.get<{ success: boolean; memberships: Membership[] }>('/memberships'),

  getActive: () =>
    http.get<{ success: boolean; memberships: Membership[] }>('/memberships/active'),

  getPending: () =>
    http.get<{ success: boolean; memberships: Membership[] }>('/memberships/pending'),

  getById: (id: string) =>
    http.get<{ success: boolean; membership: Membership }>(`/memberships/${id}`),

  cancel: (id: string) =>
    http.put<{ success: boolean; membership: Membership }>(`/memberships/${id}`, { status: 'cancelada' }),
};