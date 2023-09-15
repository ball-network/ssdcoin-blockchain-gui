import { usePrefs } from '@ssdcoin-network/api-react';

export default function useEnableAutoLogin() {
  return usePrefs<boolean>('enableAutoLogin', true);
}
