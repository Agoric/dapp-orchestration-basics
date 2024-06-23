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


import { prepareStakingAccountKit } from '@agoric/orchestration/src/exos/stakingAccountKit.js';

  
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
 *
 * @param {ZCF<StakeAtomTerms>} zcf
 * @param {{
*  orchestration: OrchestrationService;
*  storageNode: StorageNode;
*  marshaller: Marshaller;
*  timer: TimerService;
* }} privateArgs
* @param {Baggage} baggage
*/
export const start = async (zcf , privateArgs, baggage) => {

    const { orchestration, marshaller, storageNode, timer } = privateArgs;

    const zone = makeDurableZone(baggage);

    const { makeRecorderKit } = prepareRecorderKitMakers(baggage, marshaller);

    const makeStakingAccountKit = prepareStakingAccountKit(
        baggage,
        makeRecorderKit,
        zcf,
    );

    const publicFacet = zone.exo(
        'Orca Public Facet', 
        M.interface('StakeAtomI', {
            makeAccount: M.callWhen().returns(M.remotable('ChainAccount')),
            makeAcountInvitationMaker: M.call().returns(M.promise()),
        }),
        {
        
    });

    return harden({publicFacet});
}

harden(start)
