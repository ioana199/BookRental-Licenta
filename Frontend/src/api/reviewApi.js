import axiosInstance from './axiosInstance';

export const getReviewsByLibrary = (libraryId) => axiosInstance.get(`/review/getAll/${libraryId}`);
export const createReview = (libraryId, data) => axiosInstance.post(`/review/${libraryId}`, data);
export const deleteReview = (reviewId) => axiosInstance.delete(`/review/${reviewId}`);