import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

export const login = (userData) => {
  return axios.post(`${API_URL}/login`, userData);
};

export const forgotPassword = (emailData) => {
  return axios.post(`${API_URL}/forgot-password`, emailData);
};

export const resetPassword = (resetData) => {
  return axios.post(`${API_URL}/reset-password`, resetData);
};
