import api from './api';

export const getDepartments = async (activeOnly = false) => {
  const response = await api.get('/departments', { params: { active: activeOnly } });
  return response.data;
};

export const createDepartment = async (data) => {
  const response = await api.post('/departments', data);
  return response.data;
};

export const updateDepartment = async (id, data) => {
  const response = await api.put(`/departments/${id}`, data);
  return response.data;
};
