import type { UserSummary } from '../types';

const API_URL = '/api/users';

export async function getUsers(token: string): Promise<UserSummary[]> {
  const response = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};
