import axiosInstance from './axiosInstance';

export const getAllLibrarians = () => axiosInstance.get('/librarians/all');
export const getLibrarianById = (id) => axiosInstance.get(`/librarians/${id}`);
export const createLibrarian = (libraryId, data) => axiosInstance.post(`/librarians${libraryId ? `?libraryId=${libraryId}` : ''}`, data);
export const updateLibrarian = (id, data) => axiosInstance.put(`/librarians/${id}`, data);
export const deleteLibrarian = (id) => axiosInstance.delete(`/librarians/${id}`);