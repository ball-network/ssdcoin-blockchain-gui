import { type NFTInfo } from '@ssdcoin-network/api';

type NFTOnDemand = {
  nft?: NFTInfo;
  error?: Error;
  promise?: Promise<NFTInfo>;
};

export default NFTOnDemand;
