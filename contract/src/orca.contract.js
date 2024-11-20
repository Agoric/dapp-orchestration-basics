import { AmountShape } from '@agoric/ertp';
import { makeTracer } from '@agoric/internal';
import { withOrchestration } from '@agoric/orchestration/src/utils/start-helper.js';
import { ChainInfoShape } from '@agoric/orchestration/src/typeGuards.js';
import { InvitationShape } from '@agoric/zoe/src/typeGuards.js';
import { M } from '@endo/patterns';
import * as flows from './orca.flows.js';

/**
 * @import {Marshaller} from '@agoric/internal/src/lib-chainStorage.js';
 * @import {CosmosChainInfo} from '@agoric/orchestration';
 * @import {OrchestrationPowers, OrchestrationTools} from '@agoric/orchestration/src/utils/start-helper.js';
 * @import {Zone} from '@agoric/zone';
 */

/// <reference types="@agoric/vats/src/core/types-ambient"/>
/// <reference types="@agoric/zoe/src/contractFacet/types-ambient"/>

const { entries, keys } = Object;
const trace = makeTracer('OrchDev1');

const SingleAmountRecord = M.and(
  M.recordOf(M.string(), AmountShape, {
    numPropertiesLimit: 1,
  }),
  M.not(harden({})),
);

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
  customTermsShape: {
    chainDetails: M.recordOf(M.string(), ChainInfoShape),
  },
};
harden(meta);

/**
 * @typedef {{
 *   chainDetails: Record<string, CosmosChainInfo>
 * }} OrcaTerms
 *
 * @param {ZCF<OrcaTerms>} zcf
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
  { orchestrateAll, zoeTools, chainHub },
) => {
  trace('orca start contract');

  const { chainDetails } = zcf.getTerms();
  for (const [name, info] of entries(chainDetails)) {
    const { connections = {} } = info;
    trace('register', name, {
      chainId: info.chainId,
      connections: keys(connections),
    });
    chainHub.registerChain(name, info);
    for (const [chainId, connInfo] of entries(connections)) {
      chainHub.registerConnection(info.chainId, chainId, connInfo);
    }
  }

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

export const start = withOrchestration(contract);
harden(start);

/** @typedef {typeof start} OrcaSF */
