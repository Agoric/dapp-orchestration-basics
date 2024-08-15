import { InvitationShape } from '@agoric/zoe/src/typeGuards.js';
import { M } from '@endo/patterns';
import { provideOrchestration } from '@agoric/orchestration/src/utils/start-helper.js';
import { makeTracer } from '@agoric/internal';
import { AmountShape } from '@agoric/ertp';
import { atomicTransfer } from '@agoric/zoe/src/contractSupport/index.js';
import { E } from '@endo/far';
// import { VowShape } from '@agoric/vow';
import { Fail } from '@endo/errors';

import '@agoric/zoe/src/zoeService/types-ambient.js';

/**
 * @import {GuestOf} from '@agoric/async-flow';
 * @import {Amount} from '@agoric/ertp/src/types.js';
 * @import {Marshaller, StorageNode} from '@agoric/internal/src/lib-chainStorage.js';
 * @import {ChainAddress, Orchestrator} from '@agoric/orchestration';
 * @import {OrchestrationPowers} from '@agoric/orchestration/src/utils/start-helper.js';
 * @import {ZoeTools} from '@agoric/orchestration/src/utils/zoe-tools.js';
 * @import {Baggage} from '@agoric/vat-data';
 */

const trace = makeTracer('OrchDev1');
const { entries } = Object;

const SingleAmountRecord = M.and(
  M.recordOf(M.string(), AmountShape, {
    numPropertiesLimit: 1,
  }),
  M.not(harden({})),
);

/**
 * Create an account on a Cosmos chain and return a continuing offer with
 * invitations makers for Delegate, WithdrawRewards, Transfer, etc.
 *
 * @param {Orchestrator} orch
 * @param {undefined} _ctx
 * @param {ZCFSeat} seat
 * @param {{ chainName: string }} offerArgs
 */
const createAccountsFn = async (orch, _ctx, seat, { chainName }) => {
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

/**
 * @typedef {(
 * srcSeat: ZCFSeat,
 * localAccount,
 * remoteAccount,
 * give: AmountKeywordRecord,
 * amt: Amount<'nat'>,
 * localAddress: ChainAddress,
 * remoteAddress: ChainAddress,
 * ) => Promise<void>} Transfer
 */

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
const createAndFundFn = async (
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
  const [[_kw, amt]] = entries(give);
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

/**
 * @param {ZCF} zcf
 * @param {OrchestrationPowers & {
 *   marshaller: Marshaller;
 * }} privateArgs
 * @param {Baggage} baggage
 */
export const start = async (zcf, privateArgs, baggage) => {
  trace('inside start function: v1.0.95');
  trace('privateArgs', privateArgs);

  // destructure privateArgs to extract necessary services
  const {
    orchestrationService: orchestration,
    marshaller,
    storageNode,
    timerService: timer,
    localchain,
    agoricNames,
  } = privateArgs;
  trace('orchestration: ', orchestration);
  trace('marshaller: ', marshaller);
  trace('storageNode: ', storageNode);
  trace('timer: ', timer);
  trace('localchain: ', localchain);
  trace('agoricNames: ', agoricNames);
  const orchestrationProvided = provideOrchestration(
    zcf,
    baggage,
    privateArgs,
    privateArgs.marshaller,
  );

  trace('orchestrationProvided', orchestrationProvided);
  const { orchestrate, zone, vowTools, zoeTools, asyncFlowTools } =
    orchestrationProvided;

  const { asVow, watch } = vowTools;
  trace('orchestrate: ', orchestrate);
  trace('zone: ', zone);
  trace('vowTools: ', vowTools);
  trace('asVow: ', asVow);
  trace('watch: ', watch);
  trace('zoeTools: ', zoeTools);
  trace('asyncFlowTools: ', asyncFlowTools);

  const wrapper = () => {
    const transfer = vowTools.retriable(
      zone,
      'transfer',
      /**
       * @type {Transfer}
       */
      async (
        srcSeat,
        localAccount,
        remoteAccount,
        give,
        amt,
        localAddress,
        remoteAddress,
      ) => {
        !srcSeat.hasExited() || Fail`The seat cannot have exited.`;
        const { zcfSeat: tempSeat, userSeat: userSeatP } =
          zcf.makeEmptySeatKit();
        trace('tempSeat:', tempSeat);
        const userSeat = await userSeatP;
        trace('userSeat:', userSeat);
        trace('storageNode', storageNode);
        atomicTransfer(zcf, srcSeat, tempSeat, give);
        tempSeat.exit();

        const pmt = await E(userSeat).getPayout('Deposit');
        trace('pmt:', pmt);
        trace('amt:', amt);

        // NOTE: with watch
        // const promises = Object.entries(give).map(async ([kw, _amount]) => {
        //   trace("kw::", kw)
        //   trace("_amount", _amount)
        //   trace("amt", amt)
        // });
        // const watcher = zone.exo(
        //   `watcher-transfer-${localAddress.value}-to-${remoteAddress.value}`, // Error: key (a string) has already been used in this zone and incarnation -- perhaps use timestamp or offerid as well?
        //    M.interface('watcher for transfer', {
        //       onFulfilled: M.call(M.any()).optional(M.any()).returns(VowShape),
        //     }
        //   ),
        //   {
        //     /**
        //      * @param {any} _result
        //      * @param {bigint} value
        //      */
        //     onFulfilled(
        //       _result,
        //       value
        //     ) {
        //       trace("inside onFulfilled:", value)
        //       return watch(localAccount.transfer(
        //         {
        //           denom: "ubld",
        //           value: value/2n,
        //         },
        //         remoteAddress
        //       ))
        //     },
        //   },
        // );
        // trace("about to watch transfer, watcher v0.16")
        // trace("watcher", watcher)
        // watch(
        //   E(localAccount).deposit(pmt),
        //   watcher,
        //   BigInt(amt.value),
        // );
        // await Promise.all(promises);

        // NOTE: without watcher
        await E(localAccount).deposit(pmt);
        await localAccount.transfer(
          {
            denom: 'ubld',
            value: amt.value / 2n,
          },
          remoteAddress,
        );

        // const localAccountBalance = await localAccount.getBalance(amt.brand)
        // const remoteAccountbalance = await remoteAccount.getBalance(amt.brand)
        // trace("localaccount balance: ", localAccountBalance);
        // trace("remoteaccount balance: ", remoteAccountbalance);
      },
    );
    return harden({
      transfer,
    });
  };

  const wrap = wrapper();
  trace('wrapper.transfer', wrapper);

  /** @type {OfferHandler} */
  // @ts-expect-error ZCFSeat not Passable
  const makeAccount = orchestrate('makeAccount', undefined, createAccountsFn);

  /** @type {OfferHandler} */
  const makeCreateAndFund = orchestrate(
    'makeCreateAndFund',
    {
      localTransfer: zoeTools.localTransfer,
      transfer: wrap.transfer,
      // write: E(storageNode).write),
      // makeChildNode: E(storageNode).makeChildNode,
      // setValue: E(storageNode).setValue,
      setValue: storageNode.setValue,
    },
    // @ts-expect-error ZCFSeat not Passable
    createAndFundFn,
  );

  const publicFacet = zone.exo(
    'Orca Public Facet',
    M.interface('Orca PF', {
      makeAccountInvitation: M.callWhen().returns(InvitationShape),
      makeCreateAndFundInvitation: M.callWhen().returns(InvitationShape),
    }),
    {
      makeAccountInvitation() {
        return zcf.makeInvitation(makeAccount, 'Make an Orchestration Account');
      },
      makeCreateAndFundInvitation() {
        return zcf.makeInvitation(
          makeCreateAndFund,
          'Make an Orchestration Account and Fund it',
          undefined,
          M.splitRecord({ give: SingleAmountRecord }),
        );
      },
    },
  );

  return { publicFacet };
};
harden(start);
/** @typedef {typeof start} OrcaSF */
