import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8000"
});

console.log(api.defaults);

export default api;
