import { type NFTInfo } from '@ssdcoin-network/api';

type NFTState = {
  nft?: NFTInfo;
  isLoading: boolean;
  error?: Error;
};

export default NFTState;
