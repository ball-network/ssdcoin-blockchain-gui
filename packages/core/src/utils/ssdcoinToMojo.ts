import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';
import ssdcoinFormatter from './ssdcoinFormatter';

export default function ssdcoinToMojo(ssdcoin: string | number | BigNumber): BigNumber {
  return ssdcoinFormatter(ssdcoin, Unit.SSDCOIN).to(Unit.MOJO).toBigNumber();
}
