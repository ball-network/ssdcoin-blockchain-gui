import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';

import ssdcoinFormatter from './ssdcoinFormatter';

export default function mojoToSSDCoinLocaleString(mojo: string | number | BigNumber, locale?: string) {
  return ssdcoinFormatter(mojo, Unit.MOJO).to(Unit.SSDCOIN).toLocaleString(locale);
}
