import ReactCompareImage from 'react-compare-image';

import { Box, useTheme } from '@mui/material';

type ImageCompareProps = {
  title?: string;
  leftImage: string;
  rightImage: string;
  leftLabel?: string;
  rightLabel?: string;
};

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
    <Box sx={{ width: '100%', maxWidth: 900 /* opcional */, mx: 'auto', mt: 3 }}>
      <ReactCompareImage
        leftImage={safeLeft}
        rightImage={safeRight}
        leftImageAlt={leftLabel}
        rightImageAlt={rightLabel}
        leftImageLabel={leftLabel}
        rightImageLabel={rightLabel}
        sliderLineWidth={2}
        sliderLineColor={theme.palette.primary.main}
        handleSize={40}
        // El slider arranca al 50 %
        sliderPositionPercentage={0.5}
      />
    </Box>
  );
}
