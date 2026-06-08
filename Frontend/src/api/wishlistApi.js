import axiosInstance from './axiosInstance';

export const getMyWishlists = () => axiosInstance.get('/wishlists/my');
export const addToWishlist = (bookId, data) => axiosInstance.post(`/wishlists/${bookId}`, data);
export const removeFromWishlist = (bookId) => axiosInstance.delete(`/wishlists/${bookId}`);