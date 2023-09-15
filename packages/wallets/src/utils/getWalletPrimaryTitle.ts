import { WalletType } from '@ssdcoin-network/api';
import type { Wallet } from '@ssdcoin-network/api';

export default function getWalletPrimaryTitle(wallet: Wallet): string {
  switch (wallet.type) {
    case WalletType.STANDARD_WALLET:
      return 'SSDCoin';
    default:
      return wallet.meta?.name ?? wallet.name;
  }
}
