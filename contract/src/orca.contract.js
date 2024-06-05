// @ts-check

// import { Far, E } from '@endo/far';
// import { V as E } from '@agoric/vow/vat.js';
// import V from '@agoric/vow/src/E.js';
// import { V as _E } from "../../../../agoric-sdk/packages/vow/vat.js"


// import { M, getCopyBagEntries, makeCopyBag } from '@endo/patterns';
import { M } from '@endo/patterns';
import { makeCopyBag, getCopyBagEntries } from '@agoric/store'
import { AssetKind } from '@agoric/ertp/src/amountMath.js';
import '@agoric/zoe/exported.js';
import { AmountShape, AmountMath, PaymentShape } from '@agoric/ertp';
import { atomicRearrange } from '@agoric/zoe/src/contractSupport/atomicTransfer.js';
import { makeMyAddressNameAdminKit } from '@agoric/vats/src/core/utils';
// import { makeOnewayPriceAuthorityKit } from '@agoric/zoe/src/contractSupport';
import {
    defineERecorderKit,
    prepareRecorderKitMakers,
    provideAll
} from '@agoric/zoe/src/contractSupport/index.js';
import { handleParamGovernance } from '@agoric/governance/src/contractHelper.js';
import { ParamTypes } from '@agoric/governance/src/constants.js';

import { makeTracer, StorageNodeShape } from '@agoric/internal';
import { makeDurableZone } from '@agoric/zone/durable.js';

// ISSUE IMPORTING THIS, which promted yarn link: 
/*
    [!] (plugin configureBundleID) TypeError: Failed to load module "./src/orchdev.contract.js" in package "file:///Users/jovonni/Documents/projects/experiments/orca/contract/" (1 underlying failures: Cannot find external module "@agoric/orchestration/src/exos/stakingAccountKit.js" in package file:///Users/jovonni/Documents/projects/experiments/orca/contract/
src/orchdev.proposal.js
*/
import { prepareStakingAccountKit } from '@agoric/orchestration/src/exos/stakingAccountKit.js';

  


// import { Fail } from '@agoric/assert';
const { Fail } = assert;

import { makeOrchestrationFacade } from './facade.js';
import { orcUtils } from './orc.js';

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

    console.log("===== CONTRACT STARTING :) ======")
    const { hostConnectionId, controllerConnectionId, bondDenom } = zcf.getTerms();
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
