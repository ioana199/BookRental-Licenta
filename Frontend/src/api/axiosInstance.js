import axios from 'axios';
import keycloak from '../auth/keycloak';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
});

axiosInstance.interceptors.request.use((config) => {
  if (keycloak.token) {
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }
  return config;
});

export default axiosInstance;