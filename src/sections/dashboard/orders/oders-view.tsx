import React from 'react';

import { Box } from '@mui/material';

import { CONFIG } from 'src/global-config';

import { Image } from 'src/components/image';

const OrdersView = () => (
  <Box
    sx={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Image src={`${CONFIG.assetsDir}/assets/background/empty.webp`} alt="empty" />
  </Box>
);

export default OrdersView;
