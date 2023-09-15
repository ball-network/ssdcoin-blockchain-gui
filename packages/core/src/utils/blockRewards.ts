import BigNumber from 'bignumber.js';

const MOJO_PER_SSDCOIN = new BigNumber('1000000000000');
const _REWARD_PER = [
    [150000, 8],
    [6000000, 2],
    [12000000, 1],
    [18000000, 0.5],
    [24000000, 0.25],
];
const POOL_REWARD = '0.875'; // 7 / 8
const FARMER_REWARD = '0.125'; // 1 /8
const COMMUNITY_REWARD = '0.03'; // 3 / 100

function calculateReward(height: number, index = 0): number {
    if(height >= 24000000) {
      return 0.125
    } else {
      const [_height, _reward] = _REWARD_PER[index]
      return height < _height ? _reward : calculateReward(height, ++index);
    }
}

export function calculatePoolReward(height: number): BigNumber {
  return MOJO_PER_SSDCOIN.times(calculateReward(height)).times(POOL_REWARD);
}

export function calculateBaseFarmerReward(height: number): BigNumber {
  return MOJO_PER_SSDCOIN.times(calculateReward(height)).times(FARMER_REWARD);
}

export function calculateCommunityReward(height: number): BigNumber {
  return MOJO_PER_SSDCOIN.times(calculateReward(height)).times(COMMUNITY_REWARD);
}
