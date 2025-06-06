'use client';

import useAuthStore from '../../store/authStore';

// ----------------------------------------------------------------------

// Esta es una función de compatibilidad para migrar gradualmente de useAuthContext a useAuthStore
export function useAuthContext() {
  const { isAuthenticated, loading, user, login, logout, error, getUserInfo } = useAuthStore();

  // Formatear el usuario para compatibilidad con el código antiguo
  const formattedUser = user
    ? {
        ...user,
        // Asegurar que existan estos campos para el código antiguo
        displayName: user.displayName || user.name || '',
        photoURL: user.photoURL || user.picture || '',
        email: user.email || '',
      }
    : null;

  // Proporcionar una interfaz compatible con el viejo useAuthContext
  return {
    loading,
    authenticated: isAuthenticated,
    user: formattedUser,
    error,
    signInWithPassword: login,
    signOut: logout,
    checkUserSession: async () => {
      // Aprovechar para obtener la información del usuario
      try {
        await getUserInfo();
        console.log('checkUserSession llamado - compatibilidad con useAuthContext');
      } catch (e) {
        console.error('Error al obtener información del usuario en checkUserSession', e);
      }
      return true;
    },
  };
}
