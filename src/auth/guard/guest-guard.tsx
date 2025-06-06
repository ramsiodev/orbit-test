'use client';

import { useState, useEffect } from 'react';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { SplashScreen } from 'src/components/loading-screen';

import useAuthStore from '../../store/authStore';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || CONFIG.auth.redirectPath;

  const [isChecking, setIsChecking] = useState(true);

  // Usar el nuevo store de autenticación
  const { isAuthenticated, loading } = useAuthStore();

  useEffect(() => {
    // Solo ejecutar una vez al montarse el componente
    if (isChecking) {
      console.log('GuestGuard - Verificando autenticación:', {
        isAuthenticated,
        loading,
        returnTo,
      });

      if (!loading) {
        if (isAuthenticated) {
          console.log('GuestGuard - Usuario autenticado, redirigiendo a:', returnTo);
          router.replace(returnTo);
        } else {
          console.log('GuestGuard - Usuario no autenticado, mostrando hijos');
          setIsChecking(false);
        }
      }
    }
  }, [isAuthenticated, loading, isChecking, returnTo, router]);

  if (loading || (isChecking && isAuthenticated)) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
