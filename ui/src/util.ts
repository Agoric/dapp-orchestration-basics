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

const ibcChannels = {
  emerynet: {
    osmosis: 'channel-132',
  },
};

export const getIbcChannel = async (
  agoricNet: string,
  remoteChainName: string,
) => {
  if (agoricNet === 'agoric-local') {
    return queryLocalIbcChannel(remoteChainName);
  }

  return ibcChannels[agoricNet][remoteChainName];
};

const localIbcEndpoint = 'http://localhost:8081/ibc';

const queryLocalIbcChannel = async (remoteChainName: string) => {
  const res = await fetch(localIbcEndpoint);
  const ibcInfo = await res.json();
  const connection = (ibcInfo.data as []).find(
    entry =>
      entry['chain_1']['chain_name'] === 'agoric' &&
      entry['chain_2']['chain_name'] === remoteChainName,
  );
  const channel = connection['channels'][0]['chain_1']['channel_id'];

  return channel;
};
