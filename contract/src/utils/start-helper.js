import { prepareAsyncFlowTools } from '@agoric/async-flow';
import { prepareVowTools } from '@agoric/vow';
import { prepareRecorderKitMakers } from '@agoric/zoe/src/contractSupport/recorder.js';
import { makeDurableZone } from '@agoric/zone/durable.js';
// import { prepareLocalChainAccountKit } from '@agoric/orchestration/src/exos/local-chain-account-kit.js';
// import { prepareChainAccountKit } from '@agoric/orchestration/src/exos/chain-account-kit.js';

import { makeOrchestrationFacade } from '@agoric/orchestration/src/facade.js';

// import { makeChainHub } from '@agoric/orchestration/src/exos/chain-hub.js';
import { makeChainHub } from '@agoric/orchestration/src/exos/chain-hub.js';

import { prepareRemoteChainFacade } from '@agoric/orchestration/src/exos/remote-chain-facade.js';
import { prepareLocalChainFacade } from '@agoric/orchestration/src/exos/local-chain-facade.js';

import { prepareCosmosOrchestrationAccount } from '@agoric/orchestration/src/exos/cosmos-orchestration-account.js';
import { prepareLocalOrchestrationAccountKit } from '@agoric/orchestration/src/exos/local-orchestration-account.js';

// import { prepareCosmosOrchestrationAccount } from '@agoric/orchestration/src/exos/cosmosOrchestrationAccount.js';

/**
 * @import {PromiseKit} from '@endo/promise-kit'
 * @import {LocalChain} from '@agoric/vats/src/localchain.js';
 * @import {TimerService, TimerBrand} from '@agoric/time';
 * @import {Baggage} from '@agoric/vat-data';
 * @import {NameHub} from '@agoric/vats';
 * @import {Remote} from '@agoric/vow';
 * @import {OrchestrationService} from '../service.js';
 */

/**
 * @typedef {{
 *   localchain: Remote<LocalChain>;
 *   orchestrationService: Remote<OrchestrationService>;
 *   storageNode: Remote<StorageNode>;
 *   timerService: Remote<TimerService>;
 *   agoricNames: Remote<NameHub>;
 * }} OrchestrationPowers
 */

/**
 * Helper that a contract start function can use to set up the objects needed
 * for orchestration.
 *
 * @param {ZCF} zcf
 * @param {Baggage} baggage
 * @param {OrchestrationPowers} remotePowers
 * @param {Marshaller} marshaller
 */
export const provideOrchestration = (
  zcf,
  baggage,
  remotePowers,
  marshaller,
) => {
  const zone = makeDurableZone(baggage);

  console.log('provideOrchestration calls makeChainHub with', zone);
  const chainHub = makeChainHub(remotePowers.agoricNames, zone);

  // // register the agoric chain, debug
  // const agoricChainDetails = {
  //   chainId: 'agoriclocal',
  //   denom: 'ubld',
  //   expectedAddressPrefix: 'agoric',
  //   // Add other necessary details here
  // };
  // chainHub.registerChain('agoric', agoricChainDetails);

  const vowTools = prepareVowTools(zone.subZone('vows'));
  console.log('marshaller');
  console.log(marshaller);
  console.log('vowTools');
  console.log(vowTools);
  console.log('remotePowers');
  console.log(remotePowers);

  const { makeRecorderKit } = prepareRecorderKitMakers(baggage, marshaller);
  // const { makeRecorderKit } = prepareRecorderKitMakers(baggage, remotePowers.marshaller);

  console.log('makeRecorderKit');
  console.log(makeRecorderKit);

  const makeLocalOrchestrationAccountKit = prepareLocalOrchestrationAccountKit(
    zone,
    makeRecorderKit,
    zcf,
    remotePowers.timerService,
    vowTools,
    chainHub,
  );

  console.log('makeLocalOrchestrationAccountKit');
  console.log(makeLocalOrchestrationAccountKit);

  const asyncFlowTools = prepareAsyncFlowTools(zone.subZone('asyncFlow'), {
    vowTools,
  });

  console.log('asyncFlowTools');
  console.log(asyncFlowTools);

  const makeCosmosOrchestrationAccount = prepareCosmosOrchestrationAccount(
    // FIXME what zone?
    zone,
    makeRecorderKit,
    vowTools,
    zcf,
  );

  console.log('makeCosmosOrchestrationAccount');
  console.log(makeCosmosOrchestrationAccount);

  console.log("==test remote powers==")
  console.log(remotePowers)
  const makeRemoteChainFacade = prepareRemoteChainFacade(zone, {
    makeCosmosOrchestrationAccount,
    // orchestration: remotePowers.orchestrationService,
    orchestration: remotePowers.orchestration,
    storageNode: remotePowers.storageNode,
    timer: remotePowers.timerService,
    vowTools,
  });

  console.log('makeRemoteChainFacade');
  console.log(makeRemoteChainFacade);

  const makeLocalChainFacade = prepareLocalChainFacade(zone, {
    makeLocalOrchestrationAccountKit,
    localchain: remotePowers.localchain,
    // FIXME what path?
    storageNode: remotePowers.storageNode,
    orchestration: remotePowers.orchestrationService,
    timer: remotePowers.timerService,
    // timerService: remotePowers.timer,
    vowTools,
  });

  console.log('makeLocalChainFacade');
  console.log(makeLocalChainFacade);

  console.log('...remotePowers fix 90');
  console.log({ ...remotePowers });

  const facade = makeOrchestrationFacade({
    zcf,
    zone,
    chainHub,
    makeLocalOrchestrationAccountKit,
    makeRecorderKit,
    makeCosmosOrchestrationAccount,
    makeLocalChainFacade,
    makeRemoteChainFacade,
    asyncFlowTools,
    vowTools,
    ...remotePowers,
  });

  console.log('facade dev3');
  console.log(facade);
  console.log('chainHub dev3');
  console.log(chainHub);
  console.log('zone dev3');
  console.log(zone);

  // return { ...facade, chainHub, zone };
  return { ...facade, chainHub, vowTools, zone }; // TODO return makeRecorderKit?
};
harden(provideOrchestration);
