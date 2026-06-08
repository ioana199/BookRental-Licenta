import axiosInstance from './axiosInstance';

export const getAllLibraries = () => axiosInstance.get('/libraries/all');
export const getLibraryById = (id) => axiosInstance.get(`/libraries/${id}`);
export const createLibrary = (data) => axiosInstance.post('/libraries', data);
export const updateLibrary = (id, data) => axiosInstance.put(`/libraries/${id}`, data);
export const deleteLibrary = (id) => axiosInstance.delete(`/libraries/${id}`);