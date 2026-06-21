import api from './api';

export const getFiles = async (folderId = '') => {
  const { data } = await api.get(`/files${folderId ? `?folderId=${folderId}` : ''}`);
  return data;
};

export const uploadFile = async (formData, onUploadProgress) => {
  const { data } = await api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
  });
  return data;
};

export const deleteFile = async (id) => {
  const { data } = await api.delete(`/files/${id}`);
  return data;
};

export const createShareLink = async (shareData) => {
  const { data } = await api.post('/share', shareData);
  return data;
};
