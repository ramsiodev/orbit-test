import ReactCompareImage from 'react-compare-image';

import { Box, styled, useTheme } from '@mui/material';

type ImageCompareProps = {
  title?: string;
  leftImage: string;
  rightImage: string;
  leftLabel?: string;
  rightLabel?: string;
};

// Contenedor con estilos mejorados
const CompareContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  margin: '0 auto',
  marginTop: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: theme.shadows[8],
  background: theme.palette.grey[900],
  '& .react-compare-image': {
    borderRadius: 'inherit',
    overflow: 'hidden',
    '& img': {
      objectFit: 'cover',
      borderRadius: 'inherit',
      maxHeight: 500,
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'scale(1.02)',
      },
    },
  },
}));

export default function ImageCompare({
  title = 'Comparación de Imágenes',
  leftImage,
  rightImage,
  leftLabel = '',
  rightLabel = '',
}: ImageCompareProps) {
  const theme = useTheme();

  // Si faltan imágenes mostramos un placeholder genérico
  const placeholder = '/assets/icons/empty/ic_image.svg';
  const safeLeft = leftImage || placeholder;
  const safeRight = rightImage || placeholder;

  return (
    <CompareContainer>
      <ReactCompareImage
        leftImage={safeLeft}
        rightImage={safeRight}
        leftImageAlt={leftLabel}
        rightImageAlt={rightLabel}
        leftImageLabel={leftLabel}
        rightImageLabel={rightLabel}
        sliderLineWidth={10}
        sliderLineColor="rgba(145, 158, 171, 0.47)"
        handleSize={50}
        handle={
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: `rgba(145, 158, 171, 0.20)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'ew-resize',
              boxShadow: theme.shadows[12],
              border: `0px solid ${theme.palette.common.white}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: theme.shadows[16],
              },
              '&:before, &:after': {
                content: '""',
                position: 'absolute',
                width: 0,
                height: 0,
                border: '8px solid transparent',
              },
              '&:before': {
                borderRight: `8px solid ${theme.palette.common.white}`,
                transform: 'translateX(-12px)',
              },
              '&:after': {
                borderLeft: `8px solid ${theme.palette.common.white}`,
                transform: 'translateX(12px)',
              },
            }}
          />
        }
        // El slider arranca al 50 %
        sliderPositionPercentage={0.5}
      />
    </CompareContainer>
  );
}
