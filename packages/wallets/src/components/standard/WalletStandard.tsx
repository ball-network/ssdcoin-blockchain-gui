import { WalletType } from '@ssdcoin-network/api';
import { Flex, MenuItem } from '@ssdcoin-network/core';
import { Offers as OffersIcon } from '@ssdcoin-network/icons';
import { Trans } from '@lingui/macro';
import { Typography, ListItemIcon } from '@mui/material';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import WalletHeader from '../WalletHeader';
import WalletHistory from '../WalletHistory';
import WalletReceiveAddress from '../WalletReceiveAddress';
import WalletSend from '../WalletSend';
import WalletStaking from "./staking/WalletStaking";
import NFTRecover from "./nftRecover/NFTRecover";
import WalletStandardCards from './WalletStandardCards';

type StandardWalletProps = {
  walletId: number;
};

export default function StandardWallet(props: StandardWalletProps) {
  const { walletId } = props;

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTab = searchParams.get('selectedTab') || 'summary';

  const setSelectedTab = (tab: 'summary' | 'send' | 'receive' | 'staking' | 'nftRecover') => {
    setSearchParams({ selectedTab: tab });
  };

  function handleCreateOffer() {
    navigate('/dashboard/offers/builder', {
      state: {
        walletType: WalletType.STANDARD_WALLET,
        referrerPath: window.location.hash.split('#').slice(-1)[0],
      },
    });
  }

  return (
    <Flex flexDirection="column" gap={2.5}>
      <WalletHeader
        walletId={walletId}
        tab={selectedTab}
        onTabChange={setSelectedTab}
        actions={
          <MenuItem onClick={handleCreateOffer} close>
            <ListItemIcon>
              <OffersIcon />
            </ListItemIcon>
            <Typography variant="inherit" noWrap>
              <Trans>Create Offer</Trans>
            </Typography>
          </MenuItem>
        }
      />
      <Flex flexDirection="column" gap={4}>
        <WalletStandardCards walletId={walletId} />

        {(() => {
          switch (selectedTab) {
            case 'summary':
              return <WalletHistory walletId={walletId} />;
            case 'send':
              return <WalletSend walletId={walletId} />;
            case 'receive':
              return <WalletReceiveAddress walletId={walletId} />;
            case 'staking':
              return <WalletStaking walletId={walletId} />;
            case 'nftRecover':
              return <NFTRecover walletId={walletId} />;
            default:
              return null;
          }
        })()}
      </Flex>
    </Flex>
  );
}
