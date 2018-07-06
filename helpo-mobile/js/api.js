import { AsyncStorage } from 'react-native';
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:8000',
});

api.interceptors.request.use(
  async (config) => {
    config.headers.Authorization = `Token ${await AsyncStorage.getItem('token')}`;
    return config;
  },
  error => Promise.reject(error)
);

export default api;
