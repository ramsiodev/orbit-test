import { Icon } from '@iconify/react';

import { Box, Stack, Button, Dialog, Typography, DialogContent } from '@mui/material';

// ----------------------------------------------------------------------

type PurchaseConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
};

export default function PurchaseConfirmDialog({
  open,
  onClose,
  onContinue,
}: PurchaseConfirmDialogProps) {
  return (
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: '#0A0B16',
          color: 'white',
          borderRadius: 3,
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(16, 24, 40, 0.40)',
          },
        },
      }}
    >
      <DialogContent
        sx={{
          p: 4,
          pb: 0,
          display: 'flex',
          maxWidth: 400,
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 50,
            height: 50,
            borderRadius: '50%',
            bgcolor: '#DC6803',
            color: 'warning.main',
            mb: 3,
          }}
        >
          <Icon icon="si:alert-line" width={30} height={30} color="white" />
        </Box>

        <Typography gutterBottom fontSize={18}>
          Confirmación de compra
        </Typography>

        <Typography sx={{ fontSize: 14, pb: 1 }}>
          Estás a punto de enviar una misión satelital para capturar una imagen actual de la zona
          seleccionada.
        </Typography>

        <Stack component="ul" spacing={1} sx={{ pl: 2, my: 2, fontSize: 14 }}>
          <Typography component="li" variant="body1" sx={{ fontSize: 14 }}>
            La imagen será capturada en los próximos 3 días.
          </Typography>
          <Typography component="li" variant="body1" sx={{ fontSize: 14 }}>
            Se estima que estará disponible entre el 12/12/2024 y el 20/12/2024.
          </Typography>
        </Stack>

        <Typography sx={{ fontStyle: 'italic', fontSize: 14 }}>
          *Recuerda que la imagen que estás adquiriendo es actual y no corresponde al momento del
          incidente.
        </Typography>

        <Stack direction="row" spacing={2} sx={{ width: '100%', mt: 4, mb: 2, pb: 3 }}>
          <Button variant="outlined" fullWidth onClick={onClose} sx={{ height: 44 }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={onContinue}
            sx={{ height: 44 }}
          >
            Continuar
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
