'use client';

import { z as zod } from 'zod';
import { useState } from 'react';
import { m } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from '../../hooks';
import { getErrorMessage } from '../../utils';
import { signInWithPassword } from '../../context/jwt';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();
  const showPassword = useBoolean();
  const { checkUserSession } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: SignInSchemaType = {
    email: 'demo@minimals.cc',
    password: '@2Minimal',
  };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithPassword({ email: data.email, password: data.password });
      await checkUserSession?.();
      router.refresh();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

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
          {/* <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Sign in
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your credentials to access your account
            </Typography>
          </Box> */}

          <Alert severity="info" sx={{ mb: 3 }}>
            Use <strong>{defaultValues.email}</strong>
            {' with password '}
            <strong>{defaultValues.password}</strong>
          </Alert>

          {!!errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          <Form methods={methods} onSubmit={onSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Field.Text
                name="email"
                label="Email address"
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
                {/* <Link
                  component={RouterLink}
                  href="#"
                  variant="body2"
                  color="inherit"
                  sx={{ alignSelf: 'flex-end' }}
                >
                  Forgot password?
                </Link> */}

                <Field.Text
                  name="password"
                  label="Password"
                  placeholder="6+ characters"
                  type={showPassword.value ? 'text' : 'password'}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={showPassword.onToggle} edge="end">
                            <Iconify
                              icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <Button
                fullWidth
                color="primary"
                size="large"
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ mt: 1 }}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>

              {/* <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="body2">
                  Don&apos;t have an account?{' '}
                  <Link
                    component={RouterLink}
                    href={paths.auth.jwt.signUp}
                    sx={{ fontWeight: 500 }}
                  >
                    Get started
                  </Link>
                </Typography>
              </Box> */}
            </Box>
          </Form>
        </Paper>
      </m.div>
    </Box>
  );
}
