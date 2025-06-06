'use client';

import { z as zod } from 'zod';
import { m } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import useAuthStore from 'src/store/authStore';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'El email es requerido!' })
    .email({ message: 'El email debe ser una dirección válida!' }),
  password: zod
    .string()
    .min(1, { message: 'La contraseña es requerida!' })
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres!' }),
});

// Ruta a la que redirigir después del login
const DASHBOARD_PATH = '/dashboard';

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();
  const showPassword = useBoolean();
  const [redirecting, setRedirecting] = useState(false);

  // Usar el store de autenticación
  const { login, loading, error, isAuthenticated } = useAuthStore();

  const defaultValues: SignInSchemaType = {
    email: '',
    password: '',
  };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !redirecting) {
      setRedirecting(true);
      console.log('Redirigiendo al dashboard...');
      // Pequeño retraso para asegurar que todo esté establecido
      setTimeout(() => {
        router.push(DASHBOARD_PATH);
      }, 100);
    }
  }, [isAuthenticated, router, redirecting]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('Iniciando sesión con:', data.email);
      await login(data.email, data.password);

      // La redirección la maneja el useEffect
    } catch (err) {
      console.error('Error en onSubmit:', err);
      // El manejo de errores ahora está en el store
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
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Iniciar Sesión
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ingresa tus credenciales para acceder a tu cuenta
            </Typography>
          </Box>

          {!!error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Form methods={methods} onSubmit={onSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Field.Text
                name="email"
                label="Correo electrónico"
                placeholder="correo@ejemplo.com"
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
                <Field.Text
                  name="password"
                  label="Contraseña"
                  placeholder="6+ caracteres"
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
                disabled={loading || redirecting}
                sx={{ mt: 1 }}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading
                  ? 'Iniciando sesión...'
                  : redirecting
                    ? 'Redirigiendo...'
                    : 'Iniciar sesión'}
              </Button>
            </Box>
          </Form>
        </Paper>
      </m.div>
    </Box>
  );
}
