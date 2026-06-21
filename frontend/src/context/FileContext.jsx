import React, { createContext, useState, useCallback } from 'react';
import { getFiles, deleteFile } from '../services/file';

export const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = useCallback(async (folderId = '') => {
    setLoading(true);
    try {
      const res = await getFiles(folderId);
      setFiles(res.data);
    } catch (error) {
      console.error('Error fetching files', error);
    }
    setLoading(false);
  }, []);

  const removeFile = async (id) => {
    try {
      await deleteFile(id);
      setFiles(files.filter(f => f._id !== id));
    } catch (error) {
      console.error('Error deleting file', error);
    }
  };

  return (
    <FileContext.Provider value={{ files, loading, fetchFiles, setFiles, removeFile }}>
      {children}
    </FileContext.Provider>
  );
};
