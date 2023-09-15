import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import SSDCoinBlackIcon from './images/ssdcoin-black.svg';
import SSDCoinIcon from './images/ssdcoin.svg';

export default function Keys(props: SvgIconProps) {
  return <SvgIcon component={SSDCoinIcon} viewBox="0 0 200 200" {...props} />;
}

export function SSDCoinBlack(props: SvgIconProps) {
  return <SvgIcon component={SSDCoinBlackIcon} viewBox="0 0 200 200" sx={{ width: '100px', height: '100px' }} {...props} />;
}
