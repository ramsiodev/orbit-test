import { Icon } from '@iconify/react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Image } from 'src/components/image';

import type { AlertItemProps } from './AlertCardItem';

// ----------------------------------------------------------------------

export default function AlertView({
  alert,
  onGoBack,
}: {
  alert: AlertItemProps;
  onGoBack?: () => void;
}) {
  const {
    title,
    number,
    type,
    description,
    detailedDescription,
    date,
    latitude,
    longitude,
    imageUrl,
  } = alert;

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      // Fallback a navegación del navegador si no hay función onGoBack
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/dashboard/alerts';
      }
    }
  };

  const handleViewMap = () => {
    window.open(`https://maps.google.com/?q=${latitude},${longitude}`, '_blank');
  };

  // Formatea la fecha para mostrar en el formato "Lunes 18 noviembre 2024 · 14:23 PM"
  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

  return (
    <>
      {/* Cabecera con flecha de retorno y título */}
      <Stack direction="row" alignItems="center" mb={1}>
        <IconButton onClick={handleGoBack} sx={{ mr: 1 }}>
          <Icon icon="mdi:arrow-left" width={24} />
        </IconButton>
        <Typography variant="h3" sx={{ flexGrow: 1 }}>
          {title}{' '}
          <Typography component="span" sx={{ color: 'text.secondary', fontSize: 'inherit' }}>
            | #{number}
          </Typography>
        </Typography>
      </Stack>

      {/* Chips informativos */}
      <Stack direction="row" mb={3} alignItems="center" justifyContent="space-between">
        <Chip
          label={type || 'Detección de construcción'}
          color={title === 'ALERTA' ? 'error' : 'warning'}
          size="small"
        />
        <Stack direction="row" spacing={1}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            18 de noviembre 2024, 11:23
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {latitude}, {longitude}
          </Typography>
        </Stack>
      </Stack>

      {/* Imagen principal con marco rojo */}
      <Card
        sx={{
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 3,
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', height: '590px' }}>
          <Image
            slotProps={{
              overlay: {
                sx: (theme) => ({
                  backgroundImage: `linear-gradient(to bottom, transparent 90%, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.9)} 100%)`,
                }),
              },
            }}
            alt={title}
            src={imageUrl}
            sx={{
              height: '100%',
              width: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Etiqueta "Alerta" en la esquina */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 9,
              bgcolor: 'error.main',
              color: 'common.white',
              borderRadius: 1,
              px: 2,
              py: 0.5,
            }}
          >
            <Typography variant="subtitle1">Alerta</Typography>
          </Box>

          {/* Controles de navegación de imágenes */}
          <IconButton
            sx={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
              color: 'white',
            }}
          >
            <Icon icon="mdi:chevron-left" width={24} />
          </IconButton>

          <IconButton
            sx={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
              color: 'white',
            }}
          >
            <Icon icon="mdi:chevron-right" width={24} />
          </IconButton>

          <Stack
            direction="row"
            flexWrap="wrap"
            spacing={1}
            sx={{
              position: 'absolute',
              bottom: 10,
              left: 16,
              right: 16,
              zIndex: 9,
            }}
          >
            <Typography variant="body2" sx={{ bgcolor: 'transparent', color: 'white' }}>
              {formattedDate.replace('·', '')}
            </Typography>
            <Typography
              variant="body2"
              color="white"
              sx={{ bgcolor: 'transparent', color: 'white' }}
            >
              {`${latitude}, ${longitude}`}
            </Typography>
            <Typography
              variant="body2"
              color="white"
              sx={{ bgcolor: 'transparent', color: 'white', ml: 'auto' }}
            >
              DÍA DEL INCIDENTE
            </Typography>
          </Stack>
        </Box>
      </Card>

      {/* Información de fecha y ubicación */}
      <Box sx={{ mb: 4 }}>
        {/* Sección de información de movimiento */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="subtitle1"
            color="warning.main"
            fontSize="0.7rem"
            sx={{ mb: 1, textTransform: 'uppercase', fontWeight: 'bold' }}
          >
            MOVIMIENTO
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Detección de vehículo
          </Typography>
          <Typography variant="body1">
            Se ha detectado presencia de vehículos sospechosos en el área. Se recomienda alertar a
            las autoridades para una inversión urgente.
          </Typography>
        </Box>

        {/* Botones de acción */}
        <Stack direction="row" spacing={2} justifyContent="flex-end" width="100%">
          <Button
            variant="text"
            color="primary"
            fullWidth
            onClick={handleViewMap}
            sx={{ height: 48, color: 'white', width: 'fit-content' }}
            endIcon={<Icon icon="mdi:map-marker" />}
          >
            Google maps
          </Button>
        </Stack>
      </Box>
    </>
  );
}
