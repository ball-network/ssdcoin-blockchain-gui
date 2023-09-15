import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';
import ssdcoinFormatter from './ssdcoinFormatter';

export default function mojoToCATLocaleString(mojo: string | number | BigNumber, locale?: string) {
  return ssdcoinFormatter(mojo, Unit.MOJO).to(Unit.CAT).toLocaleString(locale);
}
