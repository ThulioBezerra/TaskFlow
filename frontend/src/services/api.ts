import axios from 'axios';
import type { Badge } from '../types';

const api = axios.create({
    baseURL: '/api',
});

export const getMyBadges = async (): Promise<Badge[]> => {
    const response = await api.get('/users/me/badges');
    return response.data;
};
