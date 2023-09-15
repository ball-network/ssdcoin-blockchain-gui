import { usePrefs } from '@ssdcoin-network/api-react';

export default function useHideObjectionableContent() {
  return usePrefs<boolean>('hideObjectionableContent', true);
}
