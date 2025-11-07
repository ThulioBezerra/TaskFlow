import type { AllUsers, UserSummary } from '../types';
import { api } from './api';


export async function getUsers(): Promise<AllUsers[]> {
  const response = await api.get('/users');
  if (!response.status) {
    throw new Error('Failed to fetch users');
  }
  return response.data;
};

export async function getUsersByName(name: string): Promise<UserSummary[]> {
    const response = await api.get('/users/'+name);
  if (!response.status) {
    throw new Error('Failed to fetch users');
  }
  return response.data;
};
