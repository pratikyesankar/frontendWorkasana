import axios from 'axios';

// const API = axios.create({
//   baseURL: 'http://localhost:4000',  
// });


const API = axios.create({
  baseURL: 'https://workasana-backend-ten.vercel.app/',  
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
