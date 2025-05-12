import { useRef, useState, useEffect, useCallback } from 'react';

import { Box, styled, Typography } from '@mui/material';

type ImageCompareProps = {
  title?: string;
  leftImage: string;
  rightImage: string;
  leftLabel?: string;
  rightLabel?: string;
};

/* ------------------------------------------------------------------ */
/* ––––––––––––––––– Styled helpers ––––––––––––––––– */

const Wrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  border: `1px solid ${theme.palette.grey[800]}`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(2),
}));

const Canvas = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 350,
  overflow: 'hidden',
  background: theme.palette.grey[900],
  borderRadius: theme.shape.borderRadius,
  touchAction: 'none', // evita scroll en dispositivos táctiles
}));

const Layer = styled(Box)({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Handle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: theme.palette.primary.main,
  transform: 'translate(-50%,-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'ew-resize',
  boxShadow: theme.shadows[8],
  transition: 'transform .2s ease, opacity .2s ease',
  '&:hover': { opacity: 0.9, transform: 'translate(-50%,-50%) scale(1.05)' },
}));

const Divider = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  width: 2,
  height: '100%',
  background: theme.palette.primary.main,
  transform: 'translateX(-50%)',
}));

const Label = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  padding: '4px 8px',
  borderRadius: theme.shape.borderRadius,
  background: 'rgba(0,0,0,.6)',
  color: theme.palette.common.white,
  fontSize: 12,
}));

/* ------------------------------------------------------------------ */

export default function ImageCompare({
  title = 'Comparación de Imágenes',
  leftImage,
  rightImage,
  leftLabel = 'Imagen anterior',
  rightLabel = 'Imagen actual',
}: ImageCompareProps) {
  const [position, setPosition] = useState(50); // % (0 – 100)
  const dragRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* -------------------- Handlers -------------------- */

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const percent = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(Math.max(percent, 0), 100));
  }, []);

  const onPointerMove = useCallback(
    (e: PointerEvent) => dragRef.current && updatePosition(e.clientX),
    [updatePosition]
  );

  const stopDragging = useCallback(() => {
    dragRef.current = false;
  }, []);

  /* -------------------- Effects -------------------- */

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopDragging);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stopDragging);
    };
  }, [onPointerMove, stopDragging]);

  /* -------------------- Render helper -------------------- */

  const renderImage = (src: string, alt: string) =>
    src ? (
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        loading="lazy"
      />
    ) : (
      <Layer sx={{ color: 'text.secondary', flexDirection: 'column' }}>
        <Box
          component="img"
          src="/assets/icons/empty/ic_image.svg"
          sx={{ width: 100, height: 100, opacity: 0.3 }}
          alt="placeholder"
        />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Aquí verás la imagen seleccionada del historial
        </Typography>
      </Layer>
    );

  /* -------------------- JSX -------------------- */

  return (
    <Wrapper>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {title}
      </Typography>

      <Canvas ref={containerRef}>
        {/* Capa izquierda completa */}
        <Layer>{renderImage(leftImage, leftLabel)}</Layer>

        {/* Capa derecha recortada */}
        <Layer
          sx={{
            clipPath: `polygon(${position}% 0, 100% 0, 100% 100%, ${position}% 100%)`,
          }}
        >
          {renderImage(rightImage, rightLabel)}
        </Layer>

        {/* Línea divisoria */}
        <Divider sx={{ left: `${position}%` }} />

        {/* Asa (handle) */}
        <Handle
          sx={{ left: `${position}%` }}
          onPointerDown={(e) => {
            dragRef.current = true;
            updatePosition(e.clientX); // arranque suave
          }}
        >
          <Box sx={{ width: 2, height: 20, bgcolor: 'common.white' }} />
          <Box
            sx={{
              position: 'absolute',
              width: 20,
              height: 2,
              bgcolor: 'common.white',
            }}
          />
        </Handle>

        {/* Etiquetas */}
        <Label sx={{ left: 16 }}>{leftLabel}</Label>
        <Label sx={{ right: 16 }}>{rightLabel}</Label>
      </Canvas>
    </Wrapper>
  );
}
