export const rpcEndpoints = {
  'agoric-local': {
    osmosis: 'http://127.0.0.1:26655',
    agoric: 'http://127.0.0.1:26657',
  },
  emerynet: {
    osmosis: 'https://rpc.testnet.osmosis.zone:443',
    agoric: 'https://emerynet.rpc.agoric.net',
  },
};

export const ibcChannels = {
  'agoric-local': {
    osmosis: 'channel-1',
  },
  emerynet: {
    osmosis: 'channel-115',
  },
};
