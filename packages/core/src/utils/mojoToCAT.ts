import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';

import ssdcoinFormatter from './ssdcoinFormatter';

export default function mojoToCAT(mojo: string | number | BigNumber): BigNumber {
  return ssdcoinFormatter(mojo, Unit.MOJO).to(Unit.CAT).toBigNumber();
}
