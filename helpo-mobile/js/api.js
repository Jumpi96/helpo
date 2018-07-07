import { AsyncStorage } from 'react-native';
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:8000',
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token !== null) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;
