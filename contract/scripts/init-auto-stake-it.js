/**
 * @file build core eval script to deploy auto-stake-it contract
 *
 * Usage:
 *   agoric run init-auto-stake-it.js
 * or
 *   agoric run init-auto-stake-it.js --net emerynet \
 *     --peer osmosis:connection-128:channel-115:uosmo
 */
import { makeHelpers } from '@agoric/deploy-script-support';
import {
  CosmosChainInfoShape,
  IBCConnectionInfoShape,
} from '@agoric/orchestration/src/typeGuards.js';
import { M, mustMatch } from '@endo/patterns';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import {
  getManifestForAutoStakeIt,
  startAutoStakeItContract,
} from '../../src/auto-stake-it.proposal.js';
import { makeAgd } from '../../tools/agd-lib.js';

const options = {
  net: { type: 'string' },
  peer: { type: 'string', multiple: true },
};

export const defaultProposalBuilder = async (
  { publishRef, install },
  { chainDetails },
) => {
  return harden({
    sourceSpec: '../../src/auto-stake-it.proposal.js',
    getManifestCall: [
      getManifestForAutoStakeIt.name,
      {
        installKeys: {
          autoStakeIt: publishRef(install('../../src/auto-stake-it.contract.js')),
        },
        chainDetails,
      },
    ],
  });
};

export default async (homeP, endowments) => {
  const { writeCoreEval } = await makeHelpers(homeP, endowments);
  const { scriptArgs } = endowments;
  const { values: flags } = parseArgs({ args: scriptArgs, options });

  const getNetConfig = net =>
    fetch(`https://${net}.agoric.net/network-config`)
      .then(res => res.text())
      .then(s => JSON.parse(s));

  const parsePeers = strs => {
    const peerParts = strs.map(s => s.split(':'));
    const badPeers = peerParts.filter(d => d.length !== 4);
    if (badPeers.length) {
      throw Error(
        `peers must be name:connection-X:channel-Y:denom, not ${badPeers.join(', ')}`,
      );
    }
    return peerParts;
  };

  const chainDetails = {};

  if (flags.net) {
    if (!flags.peer) throw Error('--peer required');
    const connections = {};
    const portId = 'transfer';

    const { chainName: chainId, rpcAddrs } = await getNetConfig(flags.net);
    const agd = makeAgd({ execFileSync }).withOpts({ rpcAddrs });

    for (const [peerName, myConn, myChan, denom] of parsePeers(flags.peer)) {
      console.debug(peerName, { denom });
      const connInfo = await agd
        .query(['ibc', 'connection', 'end', myConn])
        .then(x => x.connection);
      const { client_id } = connInfo;
      const clientState = await agd
        .query(['ibc', 'client', 'state', client_id])
        .then(x => x.client_state);
      const { chain_id: peerId } = clientState;
      
      chainDetails[peerName] = { chainId: peerId, stakingTokens: [{ denom }] };

      const chan = await agd
        .query(['ibc', 'channel', 'end', portId, myChan])
        .then(r => r.channel);

      const info = harden({
        client_id,
        counterparty: {
          client_id: connInfo.counterparty.client_id,
          connection_id: connInfo.counterparty.connection_id,
          prefix: { key_prefix: 'arbitrary - not used?' },
        },
        id: myConn,
        state: connInfo.state,
        transferChannel: {
          channelId: myChan,
          counterPartyChannelId: chan.counterparty.channel_id,
          counterPartyPortId: chan.counterparty.port_id,
          ordering: chan.ordering,
          portId,
          state: chan.state,
          version: chan.version,
        },
      });
      mustMatch(info, IBCConnectionInfoShape);
      connections[peerId] = info;
    }

    chainDetails['agoric'] = {
      chainId,
      stakingTokens: [{ denom: 'ubld' }],
      connections,
    };
  }
  mustMatch(harden(chainDetails), M.recordOf(M.string(), CosmosChainInfoShape));
  await writeCoreEval(startAutoStakeItContract.name, opts =>
    defaultProposalBuilder(opts, { chainDetails }),
  );
};
