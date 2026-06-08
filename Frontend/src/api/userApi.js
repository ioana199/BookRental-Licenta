import axiosInstance from './axiosInstance';

export const getAllUsers = () => axiosInstance.get('/users/all');
export const getUserById = (id) => axiosInstance.get(`/users/${id}`);
export const createUser = (data) => axiosInstance.post('/users', data);
export const updateUser = (id, data) => axiosInstance.put(`/users/${id}`, data);
export const updateUserAddress = (id, data) => axiosInstance.put(`/users/${id}/address`, data);
export const deleteUser = (id) => axiosInstance.delete(`/users/${id}`);