// @ts-check
import { M } from '@endo/patterns';
import { prepareRecorderKitMakers } from '@agoric/zoe/src/contractSupport/recorder.js';

// import { makeTracer, StorageNodeShape } from '@agoric/internal';
import { makeTracer } from './tools/debug.js';

import { makeDurableZone } from '@agoric/zone/durable.js';
// import { provideOrchestration } from './utils/util.js';

import { prepareVowTools } from '@agoric/vow';
import { prepareCosmosOrchestrationAccount } from '@agoric/orchestration/src/exos/cosmosOrchestrationAccount.js';
// import { prepareStakingAccountKit } from '@agoric/orchestration/src/exos/stakingAccountKit.js';
// import { prepareCosmosOrchestrationAccountKit, prepareCosmosOrchestrationAccount } from '@agoric/orchestration/src/exos/cosmosOrchestrationAccount.js';
// import { prepareCosmosOrchestrationAccount } from '@agoric/orchestration/src/exos/cosmos-orchestration-account.js';
  
const trace = makeTracer('OrchDev1');
export const StorageNodeShape = M.remotable('StorageNode');

/**
 * @import { Baggage } from '@agoric/vat-data';
 * @import { IBCConnectionID } from '@agoric/vats';
 * @import { TimerService } from '@agoric/time';
 * @import { ICQConnection, OrchestrationService } from '../types.js';
 */

export const meta = harden({
    privateArgsShape: {
      orchestration: M.remotable('orchestration'),
      storageNode: StorageNodeShape,
      marshaller: M.remotable('Marshaller'),
      timer: M.remotable('TimerService'),
    },
});

export const privateArgsShape = meta.privateArgsShape;


export const terms = harden({
    
});



/**
 * @param {ZCF} zcf
 * @param {{
*   agoricNames: Remote<NameHub>;
*   localchain: Remote<LocalChain>;
*   orchestrationService: Remote<OrchestrationService>;
*   storageNode: Remote<StorageNode>;
*   timerService: Remote<TimerService>;
*   marshaller: Marshaller;
* }} privateArgs
* @param {Baggage} baggage
*/
export const start = async (zcf , privateArgs, baggage) => {

    trace("CONTRACT START FUNCTION... 123 sanity check 1")
    // const { orchestration, marshaller, storageNode, timer } = privateArgs;

    const {
        agoricNames,
        localchain,
        orchestrationService,
        storageNode,
        timerService,
        marshaller,
      } = privateArgs;

    trace("CONTRACT START FUNCTION 2...")
    const zone = makeDurableZone(baggage);
    trace("CONTRACT START FUNCTION 3...")
    const { makeRecorderKit } = prepareRecorderKitMakers(baggage, marshaller);
    trace("CONTRACT START FUNCTION 4...abc-dev1")

    // TODO: fix Possible HTML comment rejected?
    const vowTools = prepareVowTools(zone.subZone('vows'));

    // TODO: fix Possible HTML comment rejected?
    const makeCosmosOrchestrationAccount = prepareCosmosOrchestrationAccount(
        zone,
        makeRecorderKit,
        vowTools,
        zcf,
      );
    console.log("makeCosmosOrchestrationAccount")
    console.log(makeCosmosOrchestrationAccount)

    trace("CONTRACT START FUNCTION 5...")
    const publicFacet = zone.exo(
        'Orca Public Facet', 
        M.interface('StakeAtomI', {
            // makeAccount: M.callWhen().returns(M.remotable('ChainAccount')),
            // makeAcountInvitationMaker: M.call().returns(M.promise()),
        }),
        {
            
        },
    );

    return harden({publicFacet});
}

// harden(start)
/** @typedef {typeof start} OrcaSF */
