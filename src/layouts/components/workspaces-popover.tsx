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
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import InputAdornment from '@mui/material/InputAdornment';

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

  const {
    subscriptions,
    isLoading,
    fetchSubscriptions,
    findStatus,
    setSelectedSubscription,
    fetchSubscriptionById,
  } = useSubscriptionStore();

  const [subscriptionsData, setSubscriptionsData] = useState<
    {
      id: string;
      name: string;
      logo: string;
      plan: string;
    }[]
  >([]);

  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para los resultados filtrados
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<
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
      setFilteredSubscriptions(mappedData);
    }
  }, [subscriptions]);

  // Filtrar suscripciones cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSubscriptions(subscriptionsData);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = subscriptionsData.filter((subscription) =>
        subscription.name.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredSubscriptions(filtered);
    }
  }, [searchTerm, subscriptionsData]);

  const [workspace, setWorkspace] = useState(data[0]);

  // Actualizar workspace seleccionado cuando se cargan las suscripciones
  useEffect(() => {
    if (subscriptionsData.length > 0 && !workspace) {
      setWorkspace(subscriptionsData[0]);
    }
  }, [subscriptionsData, workspace]);

  const handleChangeWorkspace = useCallback(
    async (newValue: (typeof subscriptionsData)[0]) => {
      setWorkspace(newValue);

      try {
        console.log('🔍 Seleccionando servicio:', newValue.id);

        // Buscar la suscripción completa en los datos existentes
        const existingSubscription = subscriptions.find((sub) => sub.id === newValue.id);

        if (existingSubscription) {
          console.log('✅ Suscripción encontrada en datos existentes:', existingSubscription);

          // Establecer la suscripción seleccionada directamente desde los datos existentes
          setSelectedSubscription(existingSubscription);

          // Consultar el estado del polígono si tiene un polygonId
          if (existingSubscription.polygonId) {
            console.log('🔍 Consultando estado del polígono:', existingSubscription.polygonId);
            await findStatus(existingSubscription.polygonId);
          } else {
            console.warn('⚠️ La suscripción no tiene polygonId:', existingSubscription);
          }
        } else {
          console.error('❌ No se encontró la suscripción en los datos existentes');
        }
      } catch (error) {
        console.error('❌ Error al seleccionar la suscripción:', error);
      }

      onClose();
    },
    [onClose, subscriptions, findStatus, setSelectedSubscription]
  );

  // Manejar cambios en el campo de búsqueda
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

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
      <Avatar alt={workspace?.name} src={workspace?.logo} sx={{ width: 24, height: 24 }} />

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
        paper: { sx: { mt: 0.5, ml: -1.55, width: 340 } },
      }}
    >
      {/* Campo de búsqueda */}
      <Box sx={{ p: 1.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar suscripción..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" width={20} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <ButtonBase onClick={() => setSearchTerm('')} sx={{ borderRadius: '50%', p: 0.5 }}>
                  <Iconify icon="solar:close-circle-bold" width={16} />
                </ButtonBase>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Scrollbar sx={{ maxHeight: 280 }}>
        <MenuList>
          {filteredSubscriptions.length > 0 ? (
            filteredSubscriptions.map((option) => (
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
              <Typography variant="body2">
                {searchTerm ? 'No se encontraron resultados' : 'No hay suscripciones disponibles'}
              </Typography>
            </MenuItem>
          )}
        </MenuList>
      </Scrollbar>
    </CustomPopover>
  );

  return (
    <>
      {renderButton()}
      {renderMenuList()}
    </>
  );
}
