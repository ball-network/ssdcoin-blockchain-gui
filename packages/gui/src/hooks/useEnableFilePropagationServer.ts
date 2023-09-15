import { usePrefs } from '@ssdcoin-network/api-react';

export default function useEnableFilePropagationServer() {
  return usePrefs<boolean>('enableFilePropagationServer', false);
}
