/**
 * @import {GuestOf} from '@agoric/async-flow';
 * @import {Amount} from '@agoric/ertp/src/types.js';
 * @import {Marshaller, StorageNode} from '@agoric/internal/src/lib-chainStorage.js';
 * @import {ChainAddress, Orchestrator} from '@agoric/orchestration';
 * @import {OrchestrationPowers, OrchestrationTools} from '@agoric/orchestration/src/utils/start-helper.js';
 * @import {ZoeTools} from '@agoric/orchestration/src/utils/zoe-tools.js';
 * @import {Transfer} from './orca.contract.js';
 */

import { makeTracer } from './debug.js';

const trace = makeTracer('OrchFlows');

/**
 * Create an account on a Cosmos chain and return a continuing offer with
 * invitations makers for Delegate, WithdrawRewards, Transfer, etc.
 *
 * @param {Orchestrator} orch
 * @param {unknown} _ctx
 * @param {ZCFSeat} seat
 * @param {{ chainName: string }} offerArgs
 */
export const makeAccount = async (orch, _ctx, seat, { chainName }) => {
  const { give } = seat.getProposal();
  trace('version 0.1.36');
  trace('give');
  trace(give);
  trace('inside createAccounts');
  trace('orch');
  trace(orch);
  trace('seat');
  trace(seat);
  trace(chainName);
  seat.exit();
  const chain = await orch.getChain(chainName);
  trace('chain object');
  trace(chain);
  const info = await chain.getChainInfo();
  trace('chain info', info);
  const chainAccount = await chain.makeAccount();
  console.log('chainAccount');
  console.log(chainAccount);

  return chainAccount.asContinuingOffer();
};
harden(makeAccount);

/**
 * Create an account on a Cosmos chain and return a continuing offer with
 * invitations makers for Delegate, WithdrawRewards, Transfer, etc.
 *
 * @param {Orchestrator} orch
 * @param {object} ctx
 * @param {Transfer} ctx.transfer
 * @param {StorageNode['setValue']} ctx.setValue
 * @param {ZCFSeat} seat
 * @param {{ chainName: string }} offerArgs
 */
export const makeCreateAndFund = async (
  orch,
  {
    transfer,
    // write,
    // makeChildNode,
    setValue,
  },
  seat,
  { chainName },
) => {
  const { give } = seat.getProposal();
  const [[_kw, amt]] = Object.entries(give);
  trace('orch', orch);
  trace('_kw', _kw);
  trace('amt', amt);
  trace('give:', give);
  // trace("write:", write);
  // trace("makeChildNode:", makeChildNode);
  trace('setValue:', setValue);

  const [agoric, chain] = await Promise.all([
    orch.getChain('agoric'),
    orch.getChain(chainName),
  ]);

  const info = await chain.getChainInfo();
  trace('chain info', info);

  const assets = await agoric.getVBankAssetInfo();
  trace('fetched assets:', assets);

  const localAccount = await agoric.makeAccount();
  trace('localAccount', localAccount);

  const remoteAccount = await chain.makeAccount();
  trace('remoteAccount', remoteAccount);
  const [localAddress, remoteAddress] = await Promise.all([
    localAccount.getAddress(),
    remoteAccount.getAddress(),
  ]);

  // vstorage tests
  trace('writing');
  // setValue(`status x`)
  // const node1 = await makeChildNode(`orca-createAndFund-${localAddress.value}-${localAddress.value}`);

  trace('localAddress', localAddress);
  trace('remoteAddress', remoteAddress);
  trace('fund new orch account');
  trace('seat', seat);
  trace('transfer', transfer);
  await transfer(
    seat,
    localAccount,
    remoteAccount,
    give,
    amt,
    localAddress,
    remoteAddress,
  );
  seat.exit();
  return remoteAccount.asContinuingOffer();
};
harden(makeCreateAndFund);
