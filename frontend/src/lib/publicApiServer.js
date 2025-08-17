import axios from 'axios';

const publicAxiosServer = axios.create({
  baseURL: process.env.BASE_SERVER_URL || 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export default publicAxiosServer;
