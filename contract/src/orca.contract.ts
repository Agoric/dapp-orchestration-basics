/// <reference types="@agoric/vats/src/core/types-ambient"/>
/// <reference types="@agoric/zoe/src/contractFacet/types-ambient"/>

import { AmountShape } from '@agoric/ertp';
import { makeTracer } from '@agoric/internal';
import { withOrchestration } from '@agoric/orchestration/src/utils/start-helper.js';
import { ChainInfoShape } from '@agoric/orchestration/src/typeGuards.js';
import { InvitationShape } from '@agoric/zoe/src/typeGuards.js';
import { M } from '@endo/patterns';
import * as flows from './orca.flows.ts';

import type { Marshaller } from '@agoric/internal/src/lib-chainStorage.js';
import type { CosmosChainInfo } from '@agoric/orchestration';
import type { OrchestrationPowers, OrchestrationTools } from '@agoric/orchestration/src/utils/start-helper.js';
import type { Zone } from '@agoric/zone';



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


export const meta: ContractMeta = {
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

type OrcaTerms = {
  chainDetails: Record<string, CosmosChainInfo>
}

const contract = async (
  zcf: ZCF<OrcaTerms>,
  privateArgs: OrchestrationPowers & {marshaller: Marshaller}, 
  zone: Zone,
  { orchestrateAll, zoeTools, chainHub }: OrchestrationTools,
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

export type OrcaSF = typeof start;  