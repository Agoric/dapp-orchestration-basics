import { StargateClient } from '@cosmjs/stargate';

const rpcEndpoints = {
  osmosis: 'http://127.0.0.1:26655',
  agoric: 'http://127.0.0.1:26657',
};

export const fetchDelegations = async (addresses: string[]) => {
  return Promise.all(
    addresses.map(async address => {
      console.log('fetching delegations for address:', address);
      let chain = '';
      if (address.startsWith('osmo1')) {
        chain = 'osmosis';
      } else if (address.startsWith('agoric1')) {
        chain = 'agoric';
      } else {
        return {
          address,
          delegations: [],
        };
      }

      const rpcEndpoint = rpcEndpoints[chain];
      try {
        const delegations = await fetchDelegationsFromRpc(address, rpcEndpoint);
        return {
          address,
          delegations,
        };
      } catch (e) {
        console.error('error fetching delegations:', e);
        return {
          address,
          delegations: [],
        };
      }
    }),
  );
};

const fetchDelegationsFromRpc = async (address: string, rpcEndpoint: string) => {
  const client = await StargateClient.connect(rpcEndpoint);
  const delegations = await client.getDelegation(address);
  return delegations.map(delegation => ({
    validatorAddress: delegation.delegation.validator_address,
    amount: delegation.balance.amount,
    denom: delegation.balance.denom,
  }));
};