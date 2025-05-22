import axios from 'axios';

import { getStorage } from '../hooks/use-local-storage';

export const createAxiosInstance = () => {
  const accessToken = getStorage('AUTH_TOKEN');
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
    },
    timeout: 10000, // 10 segundos
  });

  instance.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor para debugging
  instance.interceptors.response.use(
    (response) => {
      console.log(`Respuesta exitosa de ${response.config.url}:`, response.status);
      return response;
    },
    (error) => {
      console.error(
        `Error en petición a ${error.config?.url}:`,
        error.response?.status,
        error.message
      );
      return Promise.reject(error);
    }
  );

  return instance;
};

export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
    refreshToken: '/auth/refresh-token',
    logout: '/auth/logout',
  },
  user: {
    profile: '/auth/userinfo',
    updateProfile: '/user/profile',
  },
  subscription: {
    findAll: '/subscription',
    findStatus: '/polygon/status/:polygonId',
    findById: (id: string) => `/subscription/${id}`,
    create: '/subscription',
    update: (id: string) => `/subscription/${id}`,
    delete: (id: string) => `/subscription/${id}`,
  },
};
