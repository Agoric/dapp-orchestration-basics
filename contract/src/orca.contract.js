import { AmountShape } from '@agoric/ertp';
import { makeTracer } from '@agoric/internal';
import { withOrchestration } from '@agoric/orchestration/src/utils/start-helper.js';
import { atomicTransfer } from '@agoric/zoe/src/contractSupport/index.js';
import { InvitationShape } from '@agoric/zoe/src/typeGuards.js';
import { Fail } from '@endo/errors';
import { E } from '@endo/far';
import { M } from '@endo/patterns';
import * as flows from './orca.flows.js';

import '@agoric/zoe/src/zoeService/types-ambient.js';

/**
 * @import {GuestOf} from '@agoric/async-flow';
 * @import {Amount} from '@agoric/ertp/src/types.js';
 * @import {Marshaller, StorageNode} from '@agoric/internal/src/lib-chainStorage.js';
 * @import {ChainAddress, Orchestrator} from '@agoric/orchestration';
 * @import {OrchestrationPowers, OrchestrationTools} from '@agoric/orchestration/src/utils/start-helper.js';
 * @import {ZoeTools} from '@agoric/orchestration/src/utils/zoe-tools.js';
 * @import {Baggage} from '@agoric/vat-data';
 * @import {Zone} from '@agoric/zone';
 */

const trace = makeTracer('OrchDev1');

const SingleAmountRecord = M.and(
  M.recordOf(M.string(), AmountShape, {
    numPropertiesLimit: 1,
  }),
  M.not(harden({})),
);

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

const OrchestrationPowersShape = M.splitRecord({
  localchain: M.remotable('localchain'),
  orchestrationService: M.remotable('orchestrationService'),
  storageNode: M.remotable('storageNode'),
  timerService: M.remotable('timerService'),
  agoricNames: M.remotable('agoricNames'),
});

/** @type {ContractMeta} */
export const meta = {
  privateArgsShape: M.and(
    OrchestrationPowersShape,
    M.splitRecord({
      marshaller: M.remotable('marshaller'),
    }),
  ),
};
harden(meta);

/**
 * @param {ZCF} zcf
 * @param {OrchestrationPowers & {
 *   marshaller: Marshaller;
 * }} privateArgs
 * @param {Zone} zone
 * @param {OrchestrationTools} tools
 */
const contract = async (
  zcf,
  privateArgs,
  zone,
  { orchestrateAll, vowTools, zoeTools },
) => {
  trace('inside start function: v1.1.95');
  trace('privateArgs', privateArgs);

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
        trace('storageNode', privateArgs.storageNode);
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

  // @ts-expect-error XXX ZCFSeat not Passable
  const { makeAccount, makeCreateAndFund } = orchestrateAll(flows, {
    localTransfer: zoeTools.localTransfer,
    transfer: wrap.transfer,
    // write: E(storageNode).write),
    // makeChildNode: E(storageNode).makeChildNode,
    // setValue: E(storageNode).setValue,
    setValue: privateArgs.storageNode.setValue,
  });

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

export const start = withOrchestration(contract);
harden(start);
/** @typedef {typeof start} OrcaSF */
