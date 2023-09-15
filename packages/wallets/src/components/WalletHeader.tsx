import { useDeleteUnconfirmedTransactionsMutation } from '@ssdcoin-network/api-react';
import { Flex, ConfirmDialog, useOpenDialog, DropdownActions, MenuItem } from '@ssdcoin-network/core';
import { WalletType } from '@ssdcoin-network/api';
import { Trans } from '@lingui/macro';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Typography, ListItemIcon, Tab, Tabs } from '@mui/material';
import React, { type ReactNode } from 'react';

import WalletName from './WalletName';
import useWallet from "../hooks/useWallet";

type StandardWalletProps = {
  walletId: number;
  actions?: ReactNode;
  tab: 'summary' | 'send' | 'receive' | 'staking' | 'nftRecover';
  onTabChange: (tab: 'summary' | 'send' | 'receive' | 'staking' | 'nftRecover') => void;
};

export default function WalletHeader(props: StandardWalletProps) {
  const { walletId, actions, tab, onTabChange } = props;
  const { wallet } = useWallet(walletId);
  const openDialog = useOpenDialog();
  const [deleteUnconfirmedTransactions] = useDeleteUnconfirmedTransactionsMutation();

  async function handleDeleteUnconfirmedTransactions() {
    await openDialog(
      <ConfirmDialog
        title={<Trans>Confirmation</Trans>}
        confirmTitle={<Trans>Delete</Trans>}
        confirmColor="danger"
        onConfirm={() => deleteUnconfirmedTransactions({ walletId }).unwrap()}
      >
        <Trans>Are you sure you want to delete unconfirmed transactions?</Trans>
      </ConfirmDialog>
    );
  }

  return (
    <Flex flexDirection="column" gap={2}>
      <WalletName walletId={walletId} variant="h5" />
      <Flex gap={1} alignItems="center">
        <Flex flexGrow={1} gap={1}>
          <Tabs
            value={tab}
            onChange={(_event, newValue) => onTabChange(newValue)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab value="summary" label={<Trans>Summary</Trans>} data-testid="WalletHeader-tab-summary" />
            <Tab value="send" label={<Trans>Send</Trans>} data-testid="WalletHeader-tab-send" />
            <Tab value="receive" label={<Trans>Receive</Trans>} data-testid="WalletHeader-tab-receive" />
            {(wallet && wallet.type === WalletType.STANDARD_WALLET) && (
            <Tab value="staking" label={<Trans>Staking</Trans>} data-testid="WalletHeader-tab-staking" />
            )}
            {(wallet && wallet.type === WalletType.STANDARD_WALLET) && (
            <Tab value="nftRecover" label={<Trans>nft Recover</Trans>} data-testid="WalletHeader-tab-nftRecover" />
            )}1h1
          </Tabs>
        </Flex>
        <Flex gap={1} alignItems="center">
          {/*
          <Flex alignItems="center">
            <Typography variant="body1" color="textSecondary">
              <Trans>Status:</Trans>
            </Typography>
            &nbsp;
            <WalletStatus height={showDebugInformation} />
          </Flex>
          */}

          <DropdownActions label={<Trans>Actions</Trans>} variant="outlined">
            <MenuItem onClick={handleDeleteUnconfirmedTransactions} close>
              <ListItemIcon>
                <DeleteIcon color="info" />
              </ListItemIcon>
              <Typography variant="inherit" noWrap>
                <Trans>Delete Unconfirmed Transactions</Trans>
              </Typography>
            </MenuItem>
            {actions}
          </DropdownActions>
        </Flex>
      </Flex>
    </Flex>
  );
}
