import { usePrefs } from '@ssdcoin-network/api-react';

export default function useEnableDataLayerService() {
  return usePrefs<boolean>('enableDataLayerService', false);
}
