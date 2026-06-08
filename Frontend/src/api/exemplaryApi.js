import axiosInstance from './axiosInstance';

export const createExemplaries = (bookId, libraryId, nrToCreate) => 
  axiosInstance.post(`/exemplaries/${bookId}/${libraryId}/${nrToCreate}`);