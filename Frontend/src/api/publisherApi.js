import axiosInstance from './axiosInstance';

export const getAllPublishers = () => axiosInstance.get('/publishers/all');
export const getPublisherById = (id) => axiosInstance.get(`/publishers/${id}`);
export const createPublisher = (data) => axiosInstance.post('/publishers', data);
export const updatePublisher = (id, data) => axiosInstance.put(`/publishers/${id}`, data);
export const deletePublisher = (id) => axiosInstance.delete(`/publishers/${id}`);