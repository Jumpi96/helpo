import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization =  token ? `Token ${token}` : '';
  return config;
});


export default api;
