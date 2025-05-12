'use client';

import { m } from 'framer-motion';
import { useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export function Auth0SignInView() {
  const { loginWithPopup, loginWithRedirect } = useAuth0();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const handleSignInWithPopup = useCallback(async () => {
    try {
      await loginWithPopup();
    } catch (error) {
      console.error(error);
    }
  }, [loginWithPopup]);

  const handleSignUpWithPopup = useCallback(async () => {
    try {
      await loginWithPopup({ authorizationParams: { screen_hint: 'signup' } });
    } catch (error) {
      console.error(error);
    }
  }, [loginWithPopup]);

  const handleSignInWithRedirect = useCallback(async () => {
    try {
      await loginWithRedirect({ appState: { returnTo: returnTo || CONFIG.auth.redirectPath } });
    } catch (error) {
      console.error(error);
    }
  }, [loginWithRedirect, returnTo]);

  const handleSignUpWithRedirect = useCallback(async () => {
    try {
      await loginWithRedirect({
        appState: { returnTo: returnTo || CONFIG.auth.redirectPath },
        authorizationParams: { screen_hint: 'signup' },
      });
    } catch (error) {
      console.error(error);
    }
  }, [loginWithRedirect, returnTo]);

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: 2,
      }}
    >
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '450px' }}
      >
        <Paper
          elevation={3}
          sx={(theme) => ({
            width: '100%',
            padding: 3,
            backdropFilter: 'blur(8px)',
            border: `1px solid ${theme.palette.primary.main}`,
          })}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Sign in
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose your preferred sign in method
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Button
              fullWidth
              color="primary"
              size="large"
              variant="contained"
              onClick={handleSignInWithRedirect}
            >
              Sign in with Redirect
            </Button>

            <Button
              fullWidth
              color="primary"
              size="large"
              variant="soft"
              onClick={handleSignUpWithRedirect}
            >
              Sign up with Redirect
            </Button>

            <Button
              fullWidth
              color="inherit"
              size="large"
              variant="contained"
              onClick={handleSignInWithPopup}
            >
              Sign in with Popup
            </Button>

            <Button
              fullWidth
              color="inherit"
              size="large"
              variant="soft"
              onClick={handleSignUpWithPopup}
            >
              Sign up with Popup
            </Button>
          </Box>
        </Paper>
      </m.div>
    </Box>
  );
}
