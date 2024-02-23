import defaultsForPlotter from '../utils/defaultsForPlotter';
import optionsForPlotter from '../utils/optionsForPlotter';

import PlotterName from './PlotterName';

export default {
  displayName: 'SSDCoin Proof of Space',
  options: optionsForPlotter(PlotterName.SSDCOINPOS),
  defaults: defaultsForPlotter(PlotterName.SSDCOINPOS),
  installInfo: { installed: true },
};
