import axiosInstance from './axiosInstance';

export const getAllAuthors = () => axiosInstance.get('/authors/all');
export const createAuthor = (data) => axiosInstance.post('/authors', data);
export const updateAuthor = (id, data) => axiosInstance.put(`/authors/${id}`, data);
export const deleteAuthor = (id) => axiosInstance.delete(`/authors/${id}`);