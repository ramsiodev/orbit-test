import type { IconButtonProps } from '@mui/material/IconButton';

import { m } from 'framer-motion';
import { forwardRef } from 'react';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

import { varTap, varHover, AnimateBorder, transitionTap } from 'src/components/animate';

// ----------------------------------------------------------------------

export type AccountButtonProps = IconButtonProps & {
  photoURL?: string;
  displayName?: string;
};

export const AccountButton = forwardRef<HTMLButtonElement, AccountButtonProps>(
  function AccountButton({ photoURL = '', displayName = '', sx, onClick, ...other }, ref) {
    // Función de manejo de clic mejorada para debugging
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      console.log('AccountButton: Clic detectado');
      if (onClick) {
        onClick(event);
      }
    };

    return (
      <IconButton
        ref={ref}
        component={m.button}
        whileTap={varTap(0.96)}
        whileHover={varHover(1.04)}
        transition={transitionTap()}
        aria-label="Account button"
        onClick={handleClick} // Usar el handler personalizado
        sx={[{ p: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
        {...other}
      >
        <AnimateBorder
          sx={{ p: '3px', borderRadius: '50%', width: 40, height: 40 }}
          slotProps={{
            primaryBorder: { size: 60, width: '1px', sx: { color: 'primary.main' } },
            secondaryBorder: { sx: { color: 'warning.main' } },
          }}
        >
          <Avatar src={photoURL} alt={displayName} sx={{ width: 1, height: 1 }}>
            {displayName && displayName.charAt(0).toUpperCase()}
          </Avatar>
        </AnimateBorder>
      </IconButton>
    );
  }
);
