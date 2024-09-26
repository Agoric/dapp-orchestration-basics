import { StargateClient } from '@cosmjs/stargate';
import { rpcEndpoints } from '../../util';

export const fetchBalances = async (addresses: string[], chainName: string) => {
  return Promise.all(
    addresses.map(async address => {
      console.log('address', address);
      let chain = '';
      if (address.startsWith('osmo1')) {
        chain = 'osmosis';
      } else if (address.startsWith('agoric1')) {
        chain = 'agoric';
      } else {
        return {
          address,
          balances: [],
        };
      }

      const rpcEndpoint = rpcEndpoints[chainName][chain];
      try {
        const balance = await fetchBalanceFromRpc(address, rpcEndpoint);
        return {
          address,
          balances: balance,
        };
      } catch (e) {
        console.log('e:', e);
        return {
          address,
          balances: [],
        };
      }
    }),
  );
};

const fetchBalanceFromRpc = async (address, rpcEndpoint) => {
  const client = await StargateClient.connect(rpcEndpoint);
  const balances = await client.getAllBalances(address);
  return balances.map(coin => ({
    denom: coin.denom,
    amount: coin.amount,
  }));
};
