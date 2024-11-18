import type { Orchestrator } from '@agoric/orchestration';
import type { ZoeTools } from '@agoric/orchestration/src/utils/zoe-tools.js';
import type { DenomArg } from '@agoric/orchestration';

import { M, mustMatch } from '@endo/patterns';
import { makeTracer } from './debug.js';

const trace = makeTracer('OrchFlows');

/**
 * Create an account on a Cosmos chain and return a continuing offer with
 * invitations makers for Delegate, WithdrawRewards, Transfer, etc.
 */
export const makeAccount = async (
  orch: Orchestrator,
  _ctx: unknown,
  seat: ZCFSeat,
  offerArgs: { chainName: string; denom: string },
) => {
  trace('makeAccount');
  mustMatch(offerArgs, M.splitRecord({ chainName: M.string() }));
  const { chainName } = offerArgs;
  trace('chainName', chainName);
  seat.exit();
  const chain = await orch.getChain(chainName);
  const chainAccount = await chain.makeAccount();
  trace('chainAccount', chainAccount);
  return chainAccount.asContinuingOffer();
};
harden(makeAccount);

/**
 * Create an account on a Cosmos chain and return a continuing offer with
 * invitations makers for Delegate, WithdrawRewards, Transfer, etc.
 */
export const makeCreateAndFund = async (
  orch: Orchestrator,
  { localTransfer }: { localTransfer: ZoeTools['localTransfer'] },
  seat: ZCFSeat,
  { chainName, denom }: { chainName: string; denom: DenomArg },
) => {
  trace(
    `invoked makeCreateAndFund with chain ${chainName}, and denom ${denom}`,
  );
  const { give } = seat.getProposal();
  trace('give:', give);
  const [[_kw, amt]] = Object.entries(give);

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

  trace('localAddress', localAddress);
  trace('remoteAddress', remoteAddress);
  trace('fund new orch account 2');

  await localTransfer(seat, localAccount, give);
  trace('after transfer');

  await localAccount.transfer(
    {
      denom: 'ubld',
      value: amt.value / 2n,
    },
    remoteAddress,
  );
  seat.exit();
  const remoteChainBalance = await remoteAccount.getBalance('uosmo');
  console.log('remoteChainBalance', remoteChainBalance);

  return remoteAccount.asContinuingOffer();
};
harden(makeCreateAndFund);
