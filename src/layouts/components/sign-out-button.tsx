import type { ButtonProps } from '@mui/material/Button';

import { useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import Button from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';
import useAuthStore from 'src/auth/store/authStore';
import { signOut as jwtSignOut } from 'src/auth/context/jwt/action';
import { signOut as amplifySignOut } from 'src/auth/context/amplify/action';
import { signOut as supabaseSignOut } from 'src/auth/context/supabase/action';
import { signOut as firebaseSignOut } from 'src/auth/context/firebase/action';

// ----------------------------------------------------------------------

const signOut =
  (CONFIG.auth.method === 'supabase' && supabaseSignOut) ||
  (CONFIG.auth.method === 'firebase' && firebaseSignOut) ||
  (CONFIG.auth.method === 'amplify' && amplifySignOut) ||
  jwtSignOut;

type Props = ButtonProps & {
  onClose?: () => void;
};

export function SignOutButton({ onClose, sx, ...other }: Props) {
  const router = useRouter();

  const { checkUserSession } = useAuthContext();

  const { logout } = useAuthStore();

  const { logout: signOutAuth0 } = useAuth0();

  const handleLogout = useCallback(async () => {
    try {
      try {
        await signOut();
        await checkUserSession?.();
      } catch (e) {
        console.warn('Error en el signOut antiguo, usando el nuevo logout', e);
      }

      logout();

      onClose?.();
      router.replace('/auth/login');
    } catch (error) {
      console.error(error);
      toast.error('¡No se pudo cerrar sesión!');
    }
  }, [checkUserSession, logout, onClose, router]);

  const handleLogoutAuth0 = useCallback(async () => {
    try {
      await signOutAuth0();

      logout();

      onClose?.();
      router.replace('/auth/login');
    } catch (error) {
      console.error(error);
      toast.error('¡No se pudo cerrar sesión!');
    }
  }, [logout, onClose, router, signOutAuth0]);

  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      onClick={CONFIG.auth.method === 'auth0' ? handleLogoutAuth0 : handleLogout}
      sx={sx}
      {...other}
    >
      Cerrar sesión
    </Button>
  );
}
