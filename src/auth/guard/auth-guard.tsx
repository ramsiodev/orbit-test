'use client';

import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import useAuthStore from '../store/authStore';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};

const signInPaths = {
  jwt: paths.auth.jwt.signIn,
  auth0: paths.auth.auth0.signIn,
  amplify: paths.auth.amplify.signIn,
  firebase: paths.auth.firebase.signIn,
  supabase: paths.auth.supabase.signIn,
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  // Usar el nuevo store de autenticación
  const { isAuthenticated, loading } = useAuthStore();

  const createRedirectPath = (currentPath: string) => {
    const queryString = new URLSearchParams({ returnTo: pathname }).toString();
    return `${currentPath}?${queryString}`;
  };

  useEffect(() => {
    // Solo ejecutar una vez al montarse el componente
    if (isChecking) {
      console.log('AuthGuard - Verificando autenticación:', {
        isAuthenticated,
        loading,
        pathname,
      });

      if (!loading) {
        if (!isAuthenticated) {
          const redirectPath = '/auth/login';

          console.log('AuthGuard - Usuario no autenticado, redirigiendo a:', redirectPath);
          router.replace(redirectPath);
        } else {
          console.log('AuthGuard - Usuario autenticado, mostrando contenido protegido');
          setIsChecking(false);
        }
      }
    }
  }, [isAuthenticated, loading, isChecking, pathname, router, createRedirectPath]);

  if (loading || (isChecking && !isAuthenticated)) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
