import Fade from 'embla-carousel-fade';
import Autoplay from 'embla-carousel-autoplay';
import React, { useState, useCallback } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

import { Box, Slider, styled, useTheme, Typography, IconButton } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Carousel, useCarousel } from 'src/components/carousel';

// ----------------------------------------------------------------------

type ImageTimelinePlayerProps = {
  images: string[];
  title?: string;
  autoplayDelay?: number;
};

// Contenedor principal
const PlayerContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  // border: `1px solid rgba(145, 158, 171, 0.20)`,
  boxShadow: theme.shadows[8],
  background: theme.palette.grey[900],
}));

// Área de la imagen
const ImageArea = styled(Box)({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 0, // Asegura que esté debajo de los controles
});

// Imagen principal
const MainImage = styled('img')({
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
  objectFit: 'cover',
});

// Área de controles
const ControlsArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.grey[900],
  borderTop: `1px solid ${theme.palette.grey[800]}`,
  position: 'relative', // Asegura que no se superponga
  zIndex: 1,
}));

// Barra de progreso personalizada
const TimelineSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 8,
  padding: '13px 0',
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: theme.palette.primary.main,
    border: `3px solid ${theme.palette.common.white}`,
    boxShadow: theme.shadows[4],
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0px 0px 0px 8px ${theme.palette.primary.main}33`,
    },
  },
  '& .MuiSlider-track': {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.palette.primary.main,
  },
  '& .MuiSlider-rail': {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(145, 158, 171, 0.2)',
  },
}));

// Contenedor de botones
const PlayControls = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
});

// Indicador de imagen actual
const ImageCounter = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 14,
  minWidth: 60,
  textAlign: 'center',
}));

export default function ImageTimelinePlayer({
  images,
  title = 'Línea de tiempo de imágenes',
  autoplayDelay = 0,
}: ImageTimelinePlayerProps) {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Plugin de autoplay (inicia pausado)
  const autoplayPlugin = Autoplay({
    delay: autoplayDelay,
    stopOnInteraction: false,
    playOnInit: false, // No inicia automáticamente
  });

  // Plugin de fade para transición suave
  const fadePlugin = Fade();

  const carousel = useCarousel(
    {
      loop: true,
      align: 'center',
    },
    [autoplayPlugin, fadePlugin]
  );

  // Manejar cambio de slide
  const handleSlideChange = useCallback(() => {
    if (carousel.mainApi) {
      setCurrentIndex(carousel.mainApi.selectedScrollSnap());
    }
  }, [carousel.mainApi]);

  // Efecto para escuchar cambios del carousel
  React.useEffect(() => {
    if (carousel.mainApi) {
      carousel.mainApi.on('select', handleSlideChange);
      return () => {
        carousel.mainApi?.off('select', handleSlideChange);
      };
    }
    return undefined;
  }, [carousel.mainApi, handleSlideChange]);

  // Navegar a una imagen específica
  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const index = Array.isArray(newValue) ? newValue[0] : newValue;
    setCurrentIndex(index);
    carousel.mainApi?.scrollTo(index);
  };

  // Efecto para sincronizar el estado del autoplay
  React.useEffect(() => {
    const autoplay = carousel.mainApi?.plugins()?.autoplay;
    if (!autoplay) return undefined;

    const updatePlayState = () => {
      setIsPlaying(autoplay.isPlaying());
    };

    // Actualizar estado inicial
    updatePlayState();

    // Escuchar eventos del autoplay
    carousel.mainApi?.on('autoplay:play', updatePlayState).on('autoplay:stop', updatePlayState);

    return () => {
      carousel.mainApi?.off('autoplay:play', updatePlayState).off('autoplay:stop', updatePlayState);
    };
  }, [carousel.mainApi]);

  // Toggle play/pause mejorado
  const handlePlayPause = () => {
    const autoplay = carousel.mainApi?.plugins()?.autoplay;
    if (!autoplay) return;

    if (isPlaying) {
      autoplay.stop();
      setIsPlaying(false);
    } else {
      autoplay.play();
      setIsPlaying(true);
    }
  };

  // Navegar anterior/siguiente
  const handlePrev = () => {
    carousel.arrows.onClickPrev();
  };

  const handleNext = () => {
    carousel.arrows.onClickNext();
  };

  if (images.length === 0) {
    return (
      <PlayerContainer>
        <ImageArea>
          <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
            <Iconify icon="solar:gallery-add-bold" width={64} height={64} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              No hay imágenes disponibles
            </Typography>
          </Box>
        </ImageArea>
      </PlayerContainer>
    );
  }

  return (
    <PlayerContainer>
      {/* Título */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.grey[800]}` }}>
        <Typography variant="h6" color="text.primary">
          {title}
        </Typography>
      </Box>

      {/* Área principal de la imagen */}
      <ImageArea>
        <Carousel
          carousel={carousel}
          sx={{
            width: '100%',
            height: '100%',
            '& .embla__slide': {
              height: '100%',
            },
          }}
        >
          {images.map((image, index) => (
            <MainImage
              key={index}
              src={image}
              alt={`Imagen ${index + 1}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/icons/empty/ic_image.svg';
              }}
            />
          ))}
        </Carousel>

        {/* Indicador de imagen actual en esquina superior derecha */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: 1,
            fontSize: 14,
          }}
        >
          {currentIndex + 1} / {images.length}
        </Box>
      </ImageArea>

      <ControlsArea>
        <Slider
          value={currentIndex}
          min={0}
          max={images.length - 1}
          step={1}
          marks={images.map((_, index) => ({
            value: index,
          }))}
          onChange={handleSliderChange}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <PlayControls>
            <IconButton
              onClick={handlePrev}
              disabled={carousel.arrows.disablePrev}
              sx={{ color: 'primary.main' }}
            >
              <Icon icon="solar:arrow-left-outline" />
            </IconButton>

            <IconButton
              onClick={handlePlayPause}
              sx={{
                color: 'primary.main',
                bgcolor: 'rgba(145, 158, 171, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(145, 158, 171, 0.2)',
                },
              }}
            >
              <Iconify icon={isPlaying ? 'solar:stop-circle-bold' : 'solar:play-circle-bold'} />
            </IconButton>

            <IconButton
              onClick={handleNext}
              disabled={carousel.arrows.disableNext}
              sx={{ color: 'primary.main' }}
            >
              <Icon icon="solar:arrow-right-outline" />
            </IconButton>
          </PlayControls>

          <ImageCounter>
            Imagen {currentIndex + 1} de {images.length}
          </ImageCounter>
        </Box>
      </ControlsArea>
    </PlayerContainer>
  );
}
