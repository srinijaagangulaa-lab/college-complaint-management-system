import api from './api';

export const getAllComplaints = async (params = {}) => {
  const response = await api.get('/admin/complaints', { params });
  return response.data;
};

export const getAdminComplaintById = async (id) => {
  const response = await api.get(`/admin/complaints/${id}`);
  return response.data;
};

export const updateComplaint = async (id, data) => {
  const response = await api.put(`/admin/complaints/${id}`, data);
  return response.data;
};

export const assignComplaint = async (id, data) => {
  const response = await api.post(`/admin/complaints/${id}/assign`, data);
  return response.data;
};

export const addComment = async (id, data) => {
  const response = await api.post(`/admin/complaints/${id}/comments`, data);
  return response.data;
};

export const resolveComplaint = async (id, data) => {
  const response = await api.post(`/admin/complaints/${id}/resolve`, data);
  return response.data;
};

export const closeComplaint = async (id) => {
  const response = await api.post(`/admin/complaints/${id}/close`);
  return response.data;
};

export const deleteComplaint = async (id) => {
  const response = await api.delete(`/admin/complaints/${id}`);
  return response.data;
};
