import { InvitationShape } from '@agoric/zoe/src/typeGuards.js';
import { M } from '@endo/patterns';
import { provideOrchestration } from '@agoric/orchestration/src/utils/start-helper.js';
import { makeTracer, NonNullish } from '@agoric/internal';
import { AmountShape } from '@agoric/ertp';
import { withdrawFromSeat } from '@agoric/zoe/src/contractSupport/zoeHelpers.js';
import { deeplyFulfilled } from '@endo/marshal';
import { atomicTransfer } from '@agoric/zoe/src/contractSupport/index.js';
import { E } from '@endo/far';
import { VowShape } from '@agoric/vow';


const trace = makeTracer('OrchDev1');
const { entries } = Object;


export const SingleAmountRecord = M.and(
  M.recordOf(M.string(), AmountShape, {
    numPropertiesLimit: 1,
  }),
  M.not(harden({})),
);

/**
 * @import {Baggage} from '@agoric/vat-data';
 * @import {Orchestrator} from '@agoric/orchestration';
 * @import {OrchestrationPowers} from '@agoric/orchestration/src/utils/start-helper.js';

 * @import {GuestOf} from '@agoric/async-flow';
 * @import {ZoeTools} from '../utils/zoe-tools.js';
 * @import {Orchestrator, LocalAccountMethods, OrchestrationAccountI, OrchestrationFlow} from '../types.js';
 */

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
  trace(chainName)
  seat.exit();
  try {
    const chain = await orch.getChain(chainName);
    trace('chain object');
    trace(chain);
    const info = await chain.getChainInfo();
    trace('chain info', info);
    const chainAccount = await chain.makeAccount();
    console.log("chainAccount")
    console.log(chainAccount)

    return await chainAccount.asContinuingOffer();
  } catch (error) {
    console.error('Error in createAccounts:', error);
  }
};



/**
 * Create an account on a Cosmos chain and return a continuing offer with
 * invitations makers for Delegate, WithdrawRewards, Transfer, etc.
 *
 * @param {Orchestrator} orch
 * @param {object} ctx
 * @param { GuestOf<ZoeTools['localTransfer']>} ctx.localTransfer
 * @param { GuestOf<Wrapper['transfer']>} ctx.transfer
 * @param {ZCFSeat} seat
 * @param {{ chainName: string }} offerArgs
 */
const createAndFundFn = async (orch, { localTransfer, transfer }, seat, { chainName }) => {
  try {
    const { give } = seat.getProposal();
    const [[_kw, amt]] = entries(give);
    trace("_kw", _kw)
    trace("amt", amt)
    trace("give:", give);
    const [agoric, chain] = await Promise.all([
      orch.getChain('agoric'),
      orch.getChain(chainName),
    ]);

    const assets = await agoric.getVBankAssetInfo();
    trace('fetched assets:', assets);

    const localAccount = await agoric.makeAccount();
    trace("localAccount", localAccount)
    const remoteAccount = await chain.makeAccount();
    trace("remoteAccount", remoteAccount)
    const [localAddress, remoteAddress] = await Promise.all([
      localAccount.getAddress(),
      remoteAccount.getAddress(),
    ]);

    trace('localAddress', localAddress);
    trace('remoteAddress', remoteAddress);
    trace('fund new orch account');
    trace('seat', seat);
    trace('transfer', transfer)
    // await transfer(seat, localAccount, give, amt, remoteAddress);
    await transfer(seat, localAccount, give, amt, localAddress, remoteAddress);
    seat.exit();
    return await remoteAccount.asContinuingOffer();
  } catch (error) {
    console.error('Error in createAndFundFn:', error);
  }
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
  trace('inside start function: v1.0.95');
  trace('privateArgs', privateArgs);

  // destructure privateArgs to extract necessary services
  const {
    orchestrationService: orchestration,
    marshaller,
    storageNode,
    timer,
    localchain,
    agoricNames,
  } = privateArgs;
  trace('orchestration: ', orchestration);
  trace('marshaller: ', marshaller);
  trace('storageNode: ', storageNode);
  trace('timer: ', timer);
  trace('localchain: ', localchain);
  trace('agoricNames: ', agoricNames);
  const { orchestrate, zone, vowTools, zoeTools, makeRecorderKit, asyncFlowTools} = provideOrchestration(
    zcf,
    baggage,
    privateArgs,
    privateArgs.marshaller,
  );

  const { asVow, watch } = vowTools;
  trace('orchestrate: ', orchestrate);
  trace('zone: ', zone);
  trace('vowTools: ', vowTools);
  trace('asVow: ', asVow);
  trace('watch: ', watch);
  trace('zoeTools: ', zoeTools);
  trace('makeRecorderKit: ', makeRecorderKit);
  trace('asyncFlowTools: ', asyncFlowTools);

  /**
   * @param {Zone} zone
   * @param {{ zcf: ZCF; vowTools: VowTools }} io
   */
  const wrapper = (zone, { zcf, vowTools }) => {
    const transfer = vowTools.retriable(
      zone,
      'transfer',
      /**
       * @type {transfer}
       */
      async (srcSeat, localAccount, give, amt, localAddress, remoteAddress) => {
        !srcSeat.hasExited() || Fail`The seat cannot have exited.`;
        const { zcfSeat: tempSeat, userSeat: userSeatP } = zcf.makeEmptySeatKit();
        trace('tempSeat:', tempSeat);
        const userSeat = await userSeatP;
        trace('userSeat:', userSeat);
        atomicTransfer(zcf, srcSeat, tempSeat, give);
        tempSeat.exit();
        const promises = Object.entries(give).map(async ([kw, _amount]) => {
          trace("kw::", kw)
          trace("_amount", _amount)
          trace("amt", amt)
        });
        const pmt = await E(userSeat).getPayout("Deposit");
        trace("pmt:", pmt)
        trace("amt:", amt)
        
        const watcher = zone.exo(
          `watcher-transfer-${localAddress.value}-to-${remoteAddress.value}`, // Error: key (a string) has already been used in this zone and incarnation -- perhaps use timestamp or offerid as well?
           M.interface('watcher for transfer', {
              onFulfilled: M.call(M.any()).optional(M.any()).returns(VowShape),
            }
          ),
          {
            /**
             * @param {any} _result
             * @param {bigint} value
             */
            onFulfilled(
              _result, 
              value
            ) {
              trace("inside onFulfilled:", value)
              return watch(localAccount.transfer(
                {
                  denom: "ubld",
                  value: value/2n,
                },
                remoteAddress
              ))                    
            },
          },
        );

        trace("about to watch transfer, watcher v0.16")
        trace("watcher", watcher)
        watch(
          E(localAccount).deposit(pmt),
          watcher,
          BigInt(amt.value),
        );
        await Promise.all(promises);
        const balance = await localAccount.getBalance(amt.brand)
        trace("localaccount balance: ", balance);

      },
    );
    return harden({
      transfer,
    });
  };

  const wrap = wrapper(zone, {zcf, vowTools})
  trace("wrapper.transfer", wrapper)

  /** @type {OfferHandler} */
  const makeAccount = orchestrate(
    'makeAccount',
    undefined,
    createAccountsFn,
  );

  /** @type {OfferHandler} */
  const makeCreateAndFund = orchestrate(
    'makeCreateAndFund',
    { 
      localTransfer: zoeTools.localTransfer,
      transfer: wrap.transfer
    },
    createAndFundFn,
  );


  const publicFacet = zone.exo(
    'Orca Public Facet',
    M.interface('Orca PF', {
      makeAccountInvitation: M.callWhen().returns(InvitationShape),
      makeCreateAndFundInvitation: M.callWhen().returns(InvitationShape)
    }),
    {
      makeAccountInvitation() {
        return zcf.makeInvitation(
          makeAccount,
          'Make an Orchestration Account',
        );
      },
      makeCreateAndFundInvitation() {
        return zcf.makeInvitation(
          makeCreateAndFund,
          'Make an Orchestration Account and Fund it',
          undefined,
          M.splitRecord({ give: SingleAmountRecord })
        );
      },
    },
  );

  return { publicFacet };
};

/** @typedef {typeof start} OrcaSF */
