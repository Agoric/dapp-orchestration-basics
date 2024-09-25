import { AmountShape } from '@agoric/ertp';
import { makeTracer } from '@agoric/internal';
import { withOrchestration } from '@agoric/orchestration';
import { atomicTransfer } from '@agoric/zoe/src/contractSupport/index.js';
import { InvitationShape } from '@agoric/zoe/src/typeGuards.js';
import { Fail } from '@endo/errors';
import { E } from '@endo/far';
import { M } from '@endo/patterns';
import * as flows from './orca.flows.js';
// import {ZCF} from "@agoric/zoe/src/contractFacet/types-ambient.js"
// import '@agoric/zoe/src/zoeService/types-ambient.js';
// import '@agoric/zoe/src/contractFacet/types-ambient.js';
// import '@agoric/vats/src/core/types-ambient.js';
// import '@agoric/vow/src/types.js';
// import { Remote } from '@agoric/internal/src/types.js';
// import '@agoric/orchestration/src/types.js';
// import '@agoric/orchestration/src/exos/int'

/**
 * @import {GuestOf} from '@agoric/async-flow';
 * @import {Amount} from '@agoric/ertp/src/types.js';
 * @import {Marshaller, StorageNode} from '@agoric/internal/src/lib-chainStorage.js';
 * @import {ChainAddress, OrchestrationPowers, OrchestrationTools, CosmosInterchainService} from '@agoric/orchestration';
 * @import {ZoeTools} from '@agoric/orchestration/src/utils/zoe-tools.js';
 * @import {Baggage} from '@agoric/vat-data';
 * @import {Zone} from '@agoric/zone';
 * @import {Remote} from '@agoric/vow';
 * @import {TimerService} from '@agoric/time';
 * @import {NameHub} from '@agoric/vats';
 *
 */

// /**
//  * @typedef {import('@agoric/zoe/src/').ZCF<Record<string, unknown>>} OrcaZCF
//  */

/**
 * @typedef {import('@agoric/vats/src/localchain.js').LocalChain} LocalChain
 * @typedef {import('@agoric/zoe/src/zoeService/utils.js').ContractStartFunction} ContractStartFunction
 */

// /**
//  * @typedef {import('@agoric/zoe/src/contractFacet/types-ambient.js').ZCF} ZCF
//  */

// /**
//  * @typedef {import('@agoric/zoe/src/contractFacet/types-ambient.js').ContractStartFn} ContractStartFunction
//  */

/// <reference types="@agoric/vats/src/core/types-ambient"/>
/// <reference types="@agoric/zoe/src/contractFacet/types-ambient"/>

/**
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
 * @typedef {{
 *   localchain: Remote<LocalChain>;
 *   orchestrationService: Remote<CosmosInterchainService>;
 *   storageNode: Remote<StorageNode>;
 *   timerService: Remote<TimerService>;
 *   agoricNames: Remote<NameHub>;
 * }} OrchestrationPowers
 */

/**
 * @param {ZCF<Record<string, unknown>> | undefined} zcf
 * @param {OrchestrationPowers & {
 *   marshaller: Marshaller;
 * }} privateArgs
 * @param {Zone} zone
 * @param {OrchestrationTools} tools
 */
const contract = async (
  /** @type {ZCF<Record<string, unknown>>} */
  zcf,
  privateArgs,
  zone,
  { orchestrateAll, vowTools, zoeTools },
) => {
  trace('inside start function: v1.1.96');
  trace('privateArgs', privateArgs);

  // @ts-expect-error XXX ZCFSeat not Passable
  const { makeAccount, makeCreateAndFund } = orchestrateAll(flows, {
    localTransfer: zoeTools.localTransfer,
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

/** @type {ContractStartFunction} */
export const start = /** @type {ContractStartFunction} */ (
  withOrchestration(contract)
);
harden(start);

// /** @typedef {typeof start} OrcaSF */
/** @typedef {ContractStartFunction} OrcaSF */
