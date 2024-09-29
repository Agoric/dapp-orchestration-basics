/**
 * @file build core eval script to deploy orca contract
 *
 * Usage:
 *   agoric run init-orca.js
 * or
 *   agoric run init-orca.js --net emerynet \
 *     --peer osmosis:connection-128:channel-115:uosmo
 *
 * where connection-128 is a connection to a chain that we'll call osmosis,
 * with channel-115 for transfer and staking token denom uosmo.
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
  getManifestForOrca,
  startOrcaContract,
} from '../../src/orca.proposal.js';
import { makeAgd } from '../../tools/agd-lib.js';

/**
 * @import {CoreEvalBuilder} from '@agoric/deploy-script-support/src/externalTypes.js'
 * @import {CosmosChainInfo, IBCConnectionInfo} from '@agoric/orchestration';
 * @import {IBCChannelID, IBCConnectionID} from '@agoric/vats';
 */

/** @type {import('node:util').ParseArgsConfig['options']} */
const options = {
  net: { type: 'string' },
  peer: { type: 'string', multiple: true },
};
/** @typedef {{ net?: string, peer?: string[] }} OrcaOpts */

/** @type {CoreEvalBuilder} */
export const defaultProposalBuilder = async (
  { publishRef, install },
  { chainDetails },
) => {
  return harden({
    sourceSpec: '../../src/orca.proposal.js',
    getManifestCall: [
      getManifestForOrca.name,
      {
        installKeys: {
          orca: publishRef(install('../../src/orca.contract.js')),
        },
        chainDetails,
      },
    ],
  });
};

export default async (homeP, endowments) => {
  const { writeCoreEval } = await makeHelpers(homeP, endowments);
  const { scriptArgs } = endowments;
  /** @type {{ values: OrcaOpts }} */
  const { values: flags } = parseArgs({ args: scriptArgs, options });

  /** @param {string} net */
  const getNetConfig = net =>
    fetch(`https://${net}.agoric.net/network-config`)
      .then(res => res.text())
      .then(s => JSON.parse(s));

  /** @param {string[]} strs */
  const parsePeers = strs => {
    /** @type {[name: string, conn: IBCConnectionID, chan: IBCChannelID, denom:string][]} */
    // @ts-expect-error XXX ID syntax should be dynamically checked
    const peerParts = strs.map(s => s.split(':'));
    const badPeers = peerParts.filter(d => d.length !== 4);
    if (badPeers.length) {
      throw Error(
        `peers must be name:connection-X:channel-Y:denom, not ${badPeers.join(', ')}`,
      );
    }
    return peerParts;
  };

  /** @type {Record<string, CosmosChainInfo>} */
  const chainDetails = {};

  if (flags.net) {
    if (!flags.peer) throw Error('--peer required');
    /** @type {Record<string, IBCConnectionInfo>} */
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
      console.debug(peerName, { chainId: peerId, denom });
      chainDetails[peerName] = { chainId: peerId, stakingTokens: [{ denom }] };

      const chan = await agd
        .query(['ibc', 'channel', 'end', portId, myChan])
        .then(r => r.channel);

      /** @type {IBCConnectionInfo} */
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
  await writeCoreEval(startOrcaContract.name, opts =>
    defaultProposalBuilder(opts, { chainDetails }),
  );
};
