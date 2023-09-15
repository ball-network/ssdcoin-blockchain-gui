import BigNumber from 'bignumber.js';
import React from 'react';

import useCurrencyCode from '../../hooks/useCurrencyCode';
import mojoToSSDCoin from '../../utils/mojoToSSDCoinLocaleString';
import FormatLargeNumber from '../FormatLargeNumber';

export type MojoToSSDCoinProps = {
  value: number | BigNumber;
};

export default function MojoToSSDCoin(props: MojoToSSDCoinProps) {
  const { value } = props;
  const currencyCode = useCurrencyCode();
  const updatedValue = mojoToSSDCoin(value);

  return (
    <>
      <FormatLargeNumber value={updatedValue} />
      &nbsp;{currencyCode ?? ''}
    </>
  );
}
