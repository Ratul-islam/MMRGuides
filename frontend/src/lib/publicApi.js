'use client';

import axios from 'axios';

const publicAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export default publicAxios;
