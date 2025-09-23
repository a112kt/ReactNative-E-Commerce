import axios from 'axios';

const API = axios.create({
  baseURL: 'https://ecommerce.routemisr.com', 
  headers: {
    'Content-Type': 'application/json',
  },
});


