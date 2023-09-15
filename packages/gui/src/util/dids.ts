import { toBech32m, fromBech32m } from '@ssdcoin-network/api';

import removeHexPrefix from './removeHexPrefix';

export function didToDIDId(did: string): string {
  return toBech32m(removeHexPrefix(did), 'did:ssd:');
}

export function didFromDIDId(didId: string): string | undefined {
  let decoded: string | undefined;

  try {
    decoded = fromBech32m(didId);
  } catch (e) {
    return undefined;
  }

  return decoded;
}
