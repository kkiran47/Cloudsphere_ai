import api from './api';

export const searchFiles = async (query) => {
  const { data } = await api.post('/ai/search', { query });
  return data;
};

export const chatWithFiles = async (message) => {
  const { data } = await api.post('/ai/chat', { message });
  return data;
};

export const getFileInsights = async (id) => {
  const { data } = await api.get(`/ai/insights/${id}`);
  return data;
};
