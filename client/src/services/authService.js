import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('ccms_token');
    localStorage.removeItem('ccms_user');
  }
};
