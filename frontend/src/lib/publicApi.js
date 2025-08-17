'use client';

import axios from 'axios';

const publicAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL||' http://localhost:8000/api/v1',
});

export default publicAxios;
