'use client';

import { createPaletteChannel } from 'minimal-shared/utils';

import type { ThemeOptions } from './types';

// ----------------------------------------------------------------------

export const themeOverrides: ThemeOptions = {
  colorSchemes: {
    light: {
      palette: {
        primary: createPaletteChannel({
          lighter: '#BFE1FE',
          light: '#5FB3FB',
          main: '#2B79ED',
          dark: '#1D4CB0',
          darker: '#1D448B',
          contrastText: '#FFFFFF',
        }),
      },
    },
    dark: {
      palette: {
        primary: createPaletteChannel({
          lighter: '#BFE1FE',
          light: '#5FB3FB',
          main: '#2B79ED',
          dark: '#1D4CB0',
          darker: '#1D448B',
          contrastText: '#FFFFFF',
        }),
      },
    },
  },
};
