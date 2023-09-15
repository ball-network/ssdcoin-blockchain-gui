import { usePrefs } from '@ssdcoin-network/api-react';

export default function useSuppressShareOnCreate() {
  return usePrefs<boolean>('suppressShareOnCreate', false);
}
