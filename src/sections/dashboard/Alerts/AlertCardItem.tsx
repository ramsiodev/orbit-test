import type { SxProps } from '@mui/material';

import { useTheme } from '@mui/material/styles';
import { Box, Card, Chip, Stack, Button, Divider, Typography } from '@mui/material';

import { fDateTime } from 'src/utils/format-time';

import { Image } from 'src/components/image';

import { useAlertsStore } from './store/useAlertsStore';
import { usePurchaseConfirmDialog } from './hooks/usePurchaseConfirmDialog';

// ----------------------------------------------------------------------

export type AlertItemProps = {
  id: string;
  title: string;
  number: string;
  type: string;
  description: string;
  detailedDescription: string;
  date: Date;
  latitude: string;
  longitude: string;
  imageUrl: string;
  icon: string;
  onViewMap?: () => void;
  onDownloadImage?: () => void;
  showFullDetails?: boolean;
  sx?: SxProps;
};

export default function AlertCardItem({
  title,
  number,
  type,
  description,
  detailedDescription,
  date,
  latitude,
  longitude,
  imageUrl,
  onViewMap,
  onDownloadImage,
  showFullDetails = false,
  sx,
  ...props
}: AlertItemProps) {
  const theme = useTheme();
  const { showAlertView } = useAlertsStore();
  const { open: openPurchaseDialog } = usePurchaseConfirmDialog();

  const handleViewMap = () => {
    if (onViewMap) {
      onViewMap();
    } else {
      window.open(`https://maps.google.com/?q=${latitude},${longitude}`, '_blank');
    }
  };

  const handleDownloadImage = () => {
    // Abrir el diálogo de confirmación
    openPurchaseDialog(() => {
      // Esta función se ejecutará al hacer clic en "Continuar"
      if (onDownloadImage) {
        onDownloadImage();
      } else {
        // Abrir la imagen en una nueva ventana como fallback
        window.open(imageUrl, '_blank');
      }
    });
  };

  const handleViewDetails = () => {
    showAlertView({
      id: props.id,
      title,
      number,
      type,
      description,
      detailedDescription,
      date,
      latitude,
      longitude,
      imageUrl,
      icon: props.icon,
    });
  };

  return (
    <Card
      sx={{
        display: 'flex',
        backgroundColor: 'transparent',
        flexDirection: { xs: 'column', sm: 'row' },
        height: showFullDetails ? 'auto' : 321,
        overflow: 'hidden',
        borderRadius: 2,
        gap: 2,
        ...sx,
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', sm: showFullDetails ? '50%' : '60%' },
          position: 'relative',
          borderRadius: 2,
          minHeight: showFullDetails ? 300 : 'auto',
        }}
      >
        <Image alt={title} src={imageUrl} ratio="1/1" sx={{ height: '100%', borderRadius: 2 }} />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: title === 'ALERTA' ? 'error.main' : 'warning.main',
            color: 'common.white',
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <Typography variant="subtitle2">{title}</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          borderRadius: 2,
          p: 2,
          width: { xs: '100%', sm: showFullDetails ? '50%' : '40%' },
          display: 'flex',
          backgroundColor: '#1C252E',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            {title} | #{number}
          </Typography>
        </Box>

        <Chip
          label={type}
          color={title === 'ALERTA' ? 'error' : 'warning'}
          size="small"
          sx={{ alignSelf: 'flex-start', mb: 2 }}
        />

        <Typography variant="body1" sx={{ mb: 1 }}>
          {description}
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          {detailedDescription}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Typography variant="caption" sx={{ mb: 0.5, color: 'grey.300' }}>
            {fDateTime(date)}
          </Typography>

          <Typography variant="caption" sx={{ mb: 2, color: 'grey.300' }}>
            {latitude}, {longitude}
          </Typography>
        </Stack>

        <Divider />

        <Stack
          direction={showFullDetails ? { xs: 'column', sm: 'row' } : 'row'}
          spacing={2}
          sx={{ mt: 'auto', pt: 2 }}
        >
          <Button variant="outlined" onClick={handleViewMap} fullWidth sx={{ height: 40 }}>
            Ver en mapa
          </Button>
          {showFullDetails ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleViewDetails}
              fullWidth
              sx={{ height: 40 }}
            >
              Ver detalles
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadImage}
              fullWidth
              sx={{ height: 40 }}
            >
              Foto de alta calidad
            </Button>
          )}
        </Stack>
      </Box>
    </Card>
  );
}
