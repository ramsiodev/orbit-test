import type { AxiosInstance, AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';

export const createAxiosInstance = (): AxiosInstance => {
  const accessToken = localStorage.getItem('accessToken');
  const instance = axios.create({
    baseURL: CONFIG.serverUrl,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

// ----------------------------------------------------------------------

export const orbfetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await createAxiosInstance().get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

export const endpoints = {
  auth: {
    login: '/auth/login',
  },
};
