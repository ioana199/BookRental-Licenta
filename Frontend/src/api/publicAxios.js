import axios from 'axios';

const publicAxios = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export default publicAxios;