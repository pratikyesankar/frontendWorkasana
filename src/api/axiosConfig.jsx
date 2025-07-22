import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000',  
});

 
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
   
  return Promise.reject(error);
});

export default API;
