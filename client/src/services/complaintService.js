import api from './api';

// ---------------------------------------------------------
// CREATE COMPLAINT
// ---------------------------------------------------------
export const createComplaint = async (formData) => {
  const response = await api.post('/complaints', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  console.log('CREATE COMPLAINT RESPONSE:', response.data);

  return response.data;
};

// ---------------------------------------------------------
// GET MY COMPLAINTS
// ---------------------------------------------------------
export const getMyComplaints = async (params = {}) => {
  const response = await api.get('/complaints/my', {
    params,
  });

  console.log('GET MY COMPLAINTS RESPONSE:', response.data);

  return response.data;
};

// ---------------------------------------------------------
// GET SINGLE COMPLAINT
// ---------------------------------------------------------
export const getComplaintById = async (id) => {
  const response = await api.get(`/complaints/${id}`);

  console.log('GET COMPLAINT BY ID RESPONSE:', response.data);

  return response.data;
};

// ---------------------------------------------------------
// GET COMPLAINT HISTORY
// ---------------------------------------------------------
export const getComplaintHistory = async (id) => {
  const response = await api.get(`/complaints/${id}/history`);

  console.log('GET COMPLAINT HISTORY RESPONSE:', response.data);

  return response.data;
};