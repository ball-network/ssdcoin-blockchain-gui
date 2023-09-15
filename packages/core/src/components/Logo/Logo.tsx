import { SSDCoin } from '@ssdcoin-network/icons';
import { Box, BoxProps } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

const StyledSSDCoin = styled(SSDCoin)`
  max-width: 100%;
  width: auto;
  height: auto;
`;

export default function Logo(props: BoxProps) {
  return (
    <Box {...props}>
      <StyledSSDCoin />
    </Box>
  );
}
