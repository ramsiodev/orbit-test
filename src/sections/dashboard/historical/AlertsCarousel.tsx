import { Icon } from '@iconify/react/dist/iconify.js';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { Carousel, useCarousel, CarouselDotButtons } from 'src/components/carousel';

import AlertCardItem from './AlertCardItem';

import type { AlertItemProps } from './AlertCardItem';

// ----------------------------------------------------------------------

type AlertsCarouselProps = {
  title?: string;
  data: AlertItemProps[];
  onViewAll?: () => void;
};

export default function AlertsCarousel({
  title = 'Alertas',
  data,
  onViewAll,
}: AlertsCarouselProps) {
  const theme = useTheme();

  const carousel = useCarousel({
    loop: true,
    align: 'start',
    slideSpacing: '16px',
    slidesToShow: 1,
  });

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    }
  };

  return (
    <Box sx={{ position: 'relative', border: '1px solid #252F39', borderRadius: 2, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        <Button
          endIcon={<Iconify icon="solar:forward-bold" />}
          onClick={handleViewAll}
          color="inherit"
        >
          Ver todo
        </Button>
      </Box>

      <Carousel
        carousel={carousel}
        sx={{
          '& .embla__slide': {
            height: '100%',
          },
        }}
      >
        {data.map((item) => (
          <AlertCardItem key={item.id} {...item} />
        ))}
      </Carousel>

      <Box
        sx={{
          mt: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <IconButton
            onClick={carousel.arrows.onClickPrev}
            disabled={carousel.arrows.disablePrev}
            type="button"
            sx={{
              color: 'text.primary',
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': { bgcolor: 'background.neutral' },
            }}
          >
            <Icon icon="mingcute:left-line" width={24} />
          </IconButton>
          <CarouselDotButtons
            scrollSnaps={carousel.dots.scrollSnaps}
            selectedIndex={carousel.dots.selectedIndex}
            onClickDot={carousel.dots.onClickDot}
          />
          <IconButton
            onClick={carousel.arrows.onClickNext}
            disabled={carousel.arrows.disableNext}
            type="button"
            sx={{
              color: 'text.primary',
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': { bgcolor: 'background.neutral' },
            }}
          >
            <Icon icon="mingcute:right-line" width={24} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
