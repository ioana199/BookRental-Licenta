import axiosInstance from "./axiosInstance";

export const getAllBooks = () => axiosInstance.get("/books/all");
export const createBook = (authorId, publisherId, data) =>
  axiosInstance.post(`/books/${authorId}/${publisherId}`, data);
export const updateBook = (id, data) => axiosInstance.put(`/books/${id}`, data);
export const deleteBook = (id) => axiosInstance.delete(`/books/${id}`);
export const getBookById = (id) => axiosInstance.get(`/books/${id}`);
export const getLibrariesForBook = (id) =>
  axiosInstance.get(`/books/${id}/libraries`);
export const getTop10Books = () => axiosInstance.get("/books/top10");
