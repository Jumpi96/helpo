import axios from 'axios';
import config from './common';

const api = axios.create({
    baseURL: config.apiUrl
});

export default api;
