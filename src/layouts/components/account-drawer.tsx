'use client';

import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { usePathname } from 'src/routes/hooks';

// Importar el store de autenticación
import useAuthStore from 'src/store/authStore';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { AnimateBorder } from 'src/components/animate';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';

// ----------------------------------------------------------------------

export type AccountDrawerProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountDrawer({ data = [], sx, ...other }: AccountDrawerProps) {
  console.log('AccountDrawer: Renderizando componente');

  const pathname = usePathname();

  // Implementación manual del estado del drawer para más control
  const [open, setOpen] = useState(false);

  // Usar el nuevo store de autenticación en lugar de useMockedUser
  const { user } = useAuthStore();

  // Memoizar el handler para abrir el drawer para evitar recreaciones
  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  // Memoizar el handler para cerrar el drawer
  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const renderAvatar = () => {
    const displayName = user?.displayName || user?.name || '';
    const photoURL = user?.photoURL || user?.picture || '';

    return (
      <AnimateBorder
        sx={{ mb: 2, p: '6px', width: 96, height: 96, borderRadius: '50%' }}
        slotProps={{
          primaryBorder: { size: 120, sx: { color: 'primary.main' } },
        }}
      >
        <Avatar src={photoURL} alt={displayName} sx={{ width: 1, height: 1 }}>
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
      </AnimateBorder>
    );
  };

  // Asegurar que tenemos valores por defecto para evitar errores de tipos
  const userPhotoURL = user?.photoURL || user?.picture || '';
  const userDisplayName = user?.displayName || user?.name || '';

  console.log('AccountDrawer: Info de usuario:', { userDisplayName, userPhotoURL });

  return (
    <>
      <AccountButton
        onClick={onOpen}
        photoURL={userPhotoURL}
        displayName={userDisplayName}
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: 320 } },
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            top: 12,
            left: 12,
            zIndex: 9,
            position: 'absolute',
          }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Box
            sx={{
              pt: 8,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {renderAvatar()}

            <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
              {userDisplayName}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }} noWrap>
              {user?.email || ''}
            </Typography>
          </Box>

          {/* <Box
            sx={{
              p: 3,
              gap: 1,
              flexWrap: 'wrap',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {Array.from({ length: 3 }, (_, index) => (
              <Tooltip
                key={_mock.fullName(index + 1)}
                title={`Switch to: ${_mock.fullName(index + 1)}`}
              >
                <Avatar
                  alt={_mock.fullName(index + 1)}
                  src={_mock.image.avatar(index + 1)}
                  onClick={() => {}}
                />
              </Tooltip>
            ))}

            <Tooltip title="Add account">
              <IconButton
                sx={[
                  (theme) => ({
                    bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                    border: `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.32)}`,
                  }),
                ]}
              >
                <Iconify icon="mingcute:add-line" />
              </IconButton>
            </Tooltip>
          </Box> */}
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={onClose} />
        </Box>
      </Drawer>
    </>
  );
}
