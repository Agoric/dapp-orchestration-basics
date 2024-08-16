import { AmountShape } from '@agoric/ertp';
import { makeTracer } from '@agoric/internal';
import { withOrchestration } from '@agoric/orchestration/src/utils/start-helper.js';
import { InvitationShape } from '@agoric/zoe/src/typeGuards.js';
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
  agoricNames: M.remotable('localchagoricNamesain'),
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
  { orchestrateAll, zoeTools },
) => {
  trace('inside start function: v1.1.95');
  trace('privateArgs', privateArgs);

  // @ts-expect-error XXX ZCFSeat not Passable
  const { makeAccount, makeCreateAndFund } = orchestrateAll(flows, {
    localTransfer: zoeTools.localTransfer,
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
