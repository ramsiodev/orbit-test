'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import useAuthStore from '../store/authStore';

// ----------------------------------------------------------------------

interface AuthProviderProps {
  children: React.ReactNode;
}

// Rutas que no requieren autenticación
const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  const { isAuthenticated } = useAuthStore();

  // Solo hacer la verificación una vez al inicio
  useEffect(() => {
    if (!isInitialized) {
      console.log('AuthProvider inicializado. Estado autenticación:', isAuthenticated);
      setIsInitialized(true);

      const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/auth/');

      if (!isAuthenticated && !isPublicRoute) {
        console.log('Redirigiendo a login porque no está autenticado');
        router.push('/auth/login');
      }
    }
  }, [isInitialized, isAuthenticated, pathname, router]);

  // Esta parte solo se ejecuta cuando cambia la autenticación después de la inicialización
  useEffect(() => {
    if (isInitialized) {
      const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/auth/');

      if (isAuthenticated && isPublicRoute) {
        console.log('Usuario autenticado en ruta pública, redirigiendo a dashboard');
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isInitialized, pathname, router]);

  return <>{children}</>;
}
