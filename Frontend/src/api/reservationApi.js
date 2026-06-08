import axiosInstance from './axiosInstance';

export const updateReservationStatus = (id, status) =>
  axiosInstance.patch(`/reservations/${id}/status`, null, { params: { newStatus: status } });

export const createReservation = (bookId, libraryId, data) =>
  axiosInstance.post(`/reservations/${bookId}/${libraryId}`, data);

export const getAllReservations = () => axiosInstance.get('/reservations/all');

export const getMyReservations = () => axiosInstance.get('/reservations/my');