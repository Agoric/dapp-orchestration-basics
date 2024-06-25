// @ts-check
import { M } from '@endo/patterns';
import '@agoric/zoe/exported.js';
import {
    defineERecorderKit,
    prepareRecorderKitMakers,
    provideAll
} from '@agoric/zoe/src/contractSupport/index.js';

import { makeTracer, StorageNodeShape } from '@agoric/internal';
import { makeDurableZone } from '@agoric/zone/durable.js';
// import { provideOrchestration } from './utils/util.js';
import { prepareVowTools } from '@agoric/vow';

import { prepareCosmosOrchestrationAccount } from '@agoric/orchestration/src/exos/cosmosOrchestrationAccount.js';

  
const trace = makeTracer('OrchDev1');

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

    console.log("CONTRACT START FUNCTION... 123 sanity check 1")
    // const { orchestration, marshaller, storageNode, timer } = privateArgs;

    const {
        agoricNames,
        localchain,
        orchestrationService,
        storageNode,
        timerService,
        marshaller,
      } = privateArgs;

    console.log("CONTRACT START FUNCTION 2...")
    const zone = makeDurableZone(baggage);
    console.log("CONTRACT START FUNCTION 3...")
    const { makeRecorderKit } = prepareRecorderKitMakers(baggage, marshaller);
    console.log("CONTRACT START FUNCTION 4...zyx2")

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
    

    console.log("CONTRACT START FUNCTION 5...")
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
