'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import type { ButtonBaseProps } from '@mui/material/ButtonBase';
import type { Subscription } from 'src/store/subscriptionStore';

import { usePopover } from 'minimal-shared/hooks';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Button, { buttonClasses } from '@mui/material/Button';

import useSubscriptionStore from 'src/store/subscriptionStore';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export type WorkspacesPopoverProps = ButtonBaseProps & {
  data?: {
    id: string;
    name: string;
    logo: string;
    plan: string;
  }[];
};

export function WorkspacesPopover({ data = [], sx, ...other }: WorkspacesPopoverProps) {
  const mediaQuery = 'sm';

  const { open, anchorEl, onClose, onOpen } = usePopover();

  const { subscriptions, isLoading, fetchSubscriptions } = useSubscriptionStore();

  const [subscriptionsData, setSubscriptionsData] = useState<
    {
      id: string;
      name: string;
      logo: string;
      plan: string;
    }[]
  >([]);

  // Convertir suscripciones al formato requerido
  useEffect(() => {
    const loadSubscriptions = async () => {
      await fetchSubscriptions();
    };

    loadSubscriptions();
  }, [fetchSubscriptions]);

  // Transformar datos de suscripciones al formato requerido por el componente
  useEffect(() => {
    if (subscriptions && subscriptions.length > 0) {
      const mappedData = subscriptions.map((subscription: Subscription) => ({
        id: subscription.id,
        name: subscription.name,
        logo: '/assets/icons/polygon-icon.svg', // Logo por defecto
        plan: subscription.billingCycle, // Usar el ciclo de facturación como "plan"
      }));

      setSubscriptionsData(mappedData);
    }
  }, [subscriptions]);

  const [workspace, setWorkspace] = useState(data[0]);

  // Actualizar workspace seleccionado cuando se cargan las suscripciones
  useEffect(() => {
    if (subscriptionsData.length > 0 && !workspace) {
      setWorkspace(subscriptionsData[0]);
    }
  }, [subscriptionsData, workspace]);

  const handleChangeWorkspace = useCallback(
    (newValue: (typeof subscriptionsData)[0]) => {
      setWorkspace(newValue);
      onClose();
    },
    [onClose]
  );

  const buttonBg: SxProps<Theme> = {
    height: 1,
    zIndex: -1,
    opacity: 0,
    content: "''",
    borderRadius: 1,
    position: 'absolute',
    visibility: 'hidden',
    bgcolor: 'action.hover',
    width: 'calc(100% + 8px)',
    transition: (theme) =>
      theme.transitions.create(['opacity', 'visibility'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter,
      }),
    ...(open && {
      opacity: 1,
      visibility: 'visible',
    }),
  };

  // Si está cargando, mostrar un mensaje de carga
  if (isLoading && subscriptionsData.length === 0) {
    return (
      <ButtonBase
        disabled
        sx={[
          {
            py: 0.5,
            gap: { xs: 0.5, [mediaQuery]: 1 },
            '&::before': buttonBg,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Typography variant="subtitle2">Cargando...</Typography>
      </ButtonBase>
    );
  }

  const renderButton = () => (
    <ButtonBase
      disableRipple
      onClick={onOpen}
      sx={[
        {
          py: 0.5,
          gap: { xs: 0.5, [mediaQuery]: 1 },
          '&::before': buttonBg,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        component="img"
        alt={workspace?.name}
        src={workspace?.logo}
        sx={{ width: 24, height: 24, borderRadius: '50%' }}
      />

      <Box
        component="span"
        sx={{ typography: 'subtitle2', display: { xs: 'none', [mediaQuery]: 'inline-flex' } }}
      >
        {workspace?.name}
      </Box>

      <Label
        color={workspace?.plan === 'MONTHLY' ? 'info' : 'success'}
        sx={{
          height: 22,
          cursor: 'inherit',
          display: { xs: 'none', [mediaQuery]: 'inline-flex' },
        }}
      >
        {workspace?.plan}
      </Label>

      <Iconify width={16} icon="carbon:chevron-sort" sx={{ color: 'text.disabled' }} />
    </ButtonBase>
  );

  const renderMenuList = () => (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{
        arrow: { placement: 'top-left' },
        paper: { sx: { mt: 0.5, ml: -1.55, width: 240 } },
      }}
    >
      <Scrollbar sx={{ maxHeight: 240 }}>
        <MenuList>
          {subscriptionsData.length > 0 ? (
            subscriptionsData.map((option) => (
              <MenuItem
                key={option.id}
                selected={option.id === workspace?.id}
                onClick={() => handleChangeWorkspace(option)}
                sx={{ height: 48 }}
              >
                <Avatar alt={option.name} src={option.logo} sx={{ width: 24, height: 24 }} />

                <Typography
                  noWrap
                  component="span"
                  variant="body2"
                  sx={{ flexGrow: 1, fontWeight: 'fontWeightMedium' }}
                >
                  {option.name}
                </Typography>

                <Label color={option.plan === 'MONTHLY' ? 'info' : 'success'}>{option.plan}</Label>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled sx={{ height: 48 }}>
              <Typography variant="body2">No hay suscripciones disponibles</Typography>
            </MenuItem>
          )}
        </MenuList>
      </Scrollbar>

      <Divider sx={{ my: 0.5, borderStyle: 'dashed' }} />

      <Button
        fullWidth
        startIcon={<Iconify width={18} icon="mingcute:add-line" />}
        onClick={() => {
          onClose();
        }}
        sx={{
          gap: 2,
          justifyContent: 'flex-start',
          fontWeight: 'fontWeightMedium',
          [`& .${buttonClasses.startIcon}`]: {
            m: 0,
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        Crear suscripción
      </Button>
    </CustomPopover>
  );

  return (
    <>
      {renderButton()}
      {renderMenuList()}
    </>
  );
}
