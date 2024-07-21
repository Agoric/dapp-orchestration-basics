// import { makeTracer, StorageNodeShape } from '@agoric/internal';
import { Far, E } from '@endo/far';
import { makeTracer } from '@agoric/internal';
import { TimerServiceShape } from '@agoric/time';
import { prepareVowTools } from '@agoric/vow';
// import { heapVowE as E } from '@agoric/vow/vat.js';
// import { heapVowE } from '@agoric/vow/vat.js';

import { deeplyFulfilled } from '@endo/marshal';

import {
  prepareRecorderKitMakers,
  provideAll,
} from '@agoric/zoe/src/contractSupport/index.js';
import { InvitationShape } from '@agoric/zoe/src/typeGuards.js';
import { makeDurableZone } from '@agoric/zone/durable.js';
import { M, mustMatch } from '@endo/patterns';
// import { prepareCosmosOrchestrationAccount } from '@agoric/orchestration/src/exos/cosmos-orchestration-account.js';
// import { prepareLocalChainAccountKit } from '@agoric/orchestration/src/exos/local-chain-account-kit.js';

import { prepareChainAccountKit } from '@agoric/orchestration/src/exos/chain-account-kit.js';
// import { makeChainHub } from '@agoric/orchestration/src/utils/chain-hub.js';

/// // sendanywhere:
import { withdrawFromSeat } from '@agoric/zoe/src/contractSupport/zoeHelpers.js';
import { AmountShape } from '@agoric/ertp';
import { CosmosChainInfoShape } from '@agoric/orchestration/src/typeGuards.js';
import { provideOrchestration } from '@agoric/orchestration/src/utils/start-helper.js';

// create a tracer for logging with the label 'OrchDev1'
const trace = makeTracer('OrchDev1');
export const StorageNodeShape = M.remotable('StorageNode');

/**
 * @import {Baggage} from '@agoric/vat-data';
 * @import {IBCConnectionID} from '@agoric/vats';
 * @import {TimerService} from '@agoric/time';
 * @import {ICQConnection, OrchestrationService, IcaAccount, CosmosValidatorAddress, Orchestrator} from '../types.js';
 * @import {LocalChain} from '@agoric/vats/src/localchain.js';
 * @import {NameHub} from '@agoric/vats';
 * @import {Remote} from '@agoric/internal';
 */

/**
 * @import {Orchestrator, IcaAccount, CosmosValidatorAddress} from './types.js'
 * @import {TimerService} from '@agoric/time';
 * @import {Baggage} from '@agoric/vat-data';
 * @import {LocalChain} from '@agoric/vats/src/localchain.js';
 * @import {NameHub} from '@agoric/vats';
 * @import {Remote} from '@agoric/internal';
 * @import {OrchestrationService} from '../service.js';
 */

/** @type {ContractMeta<typeof start>} */
export const meta = harden({
  // define the shapes of the private arguments for the contract
  privateArgsShape: {
    agoricNames: M.remotable('agoricNames'),
    // orchestration: M.remotable('orchestration'),
    cosmosInterchainService: M.remotable('cosmosInterchainService'),
    storageNode: StorageNodeShape,
    marshaller: M.remotable('marshaller'),
    timer: TimerServiceShape,
    localchain: M.remotable('localchain'),
  },
});

// export the privateArgsShape for use elsewhere
export const privateArgsShape = meta.privateArgsShape;

/**
 * @typedef {{
 *   chainId: string;
 *   hostConnectionId: IBCConnectionID;
 *   controllerConnectionId: IBCConnectionID;
 *   bondDenom: string;
 *   icqEnabled: boolean;
 * }} OrcaTerms
 */

/**
 * handler function for creating and managing accounts
 * @param {Orchestrator} orch
 * @param {object} ctx
 * @param {ZCF} ctx.zcf
 * @param {ZCFSeat} seat
 * @param {object} offerArgs
 */
const createAccountsFn = async (orch, { zcf }, seat, offerArgs) => {
  const { give } = seat.getProposal();
  trace('version 0.1.30');
  trace('give');
  trace(give);
  trace('inside createAccounts');
  trace('orch');
  trace(orch);
  trace('seat');
  trace(seat);
  // trace("offerArgs")
  // trace(offerArgs) // conversion throw because undefined for now
  trace('zcf');
  trace(zcf);
  seat.exit();
  try {
    // const chain = await E(orch).getChain('osmosis'); //host code vs guest
    const chain = await orch.getChain('osmosis');
    trace('chain');
    trace(chain);

    // const info = await E(chain).getChainInfo();
    const info = await chain.getChainInfo();
    trace('info', info);

    // const localChain = orch.getChain('agoric');
    // trace("localChain");
    // trace(localChain);

    // const [chainAccount, localAccount] = await Promise.all([
    //   chain.makeAccount(),
    //   localChain.makeAccount(),
    // ]);

    const chainAccount = await chain.makeAccount();
    console.log("chainAccount")
    console.log(chainAccount)
    return chainAccount.asContinuingOffer();

    // const localAccount = await localChain.makeAccount();
    // console.log("localAccount")
    // console.log(localAccount)

    // const chainAddress = await chainAccount.getAddress(); // maybe not use e
    // trace("chainAddress");
    // trace(chainAddress);

    // const localAddress = await localAccount.getAddress();
    // trace("localAddress");
    // trace(localAddress);

    // M.remoteable
    
  } catch (error) {
    console.error('Error in createAccounts:', error);
  }
};

export const start = async (zcf, privateArgs, baggage) => {
  // const zone = makeDurableZone(baggage);
  trace('inside start function: v1.0.78');
  trace('privateArgs', privateArgs);

  // destructure privateArgs to extract necessary services
  const {
    cosmosInterchainService: orchestration,
    marshaller,
    storageNode,
    timer,
    localchain,
    agoricNames,
  } = privateArgs;
  trace('orchestration: ', orchestration);
  trace('marshaller: ', marshaller);
  trace('storageNode: ', storageNode);
  trace('timer: ', timer);
  trace('localchain: ', localchain);
  trace('agoricNames: ', agoricNames);

  // provide all necessary nodes, creating them if they don't exist
  // const { accountsStorageNode } = await provideAll(baggage, {
  //   accountsStorageNode: () => E(storageNode).makeChildNode('accounts'),
  // });
  // trace('accountsStorageNode', accountsStorageNode);

  // prepare recorder kit makers for recording state changes
  // const { makeRecorderKit } = prepareRecorderKitMakers(baggage, marshaller);
  // trace('makeRecorderKit', makeRecorderKit);

  // const { chainHub, orchestrate, zone } = provideOrchestration(
  const { orchestrate, chainHub, vowTools, zone } = provideOrchestration(
    // const { chainHub, orchestrate, vowTools } = provideOrchestration(
    zcf,
    baggage,
    {
      agoricNames,
      orchestrationService: orchestration,
      storageNode,
      timerService: timer,
      localchain,
    },
    marshaller,
  );

  console.log('Got an orchestrate object version 0.52.121');
  console.log(orchestrate);

  // const chains = await chainHub.getChainsAndConnection()
  // console.log("chains from chainhub")
  // console.log(chains)

  const createAccounts = orchestrate(
    'LSTTia', 
    { zcf }, 
    createAccountsFn
  );

  const ConnectionInfoShape = M.record(); // TODO

  const publicFacet = zone.exo(
    'OrcaFacet',
    M.interface('OrcaFacet', {
      // makeAccountInvitation: M.call().returns(M.promise()), // returns remotable, M.promise() // telling exo machibery to
      makeAccountInvitation: M.callWhen().returns(InvitationShape)
    }),
    {
      async makeAccountInvitation() {
        // const invitation = await zcf.makeInvitation(
        //   createAccounts,
        //   'Create accounts',
        //   undefined,
        //   harden({
        //     give: {},
        //     want: {},
        //     exit: M.any(),
        //   }),
        // );
        // // return Promise.resolve(invitation);
        // return invitation;
        // return M.promise()
        return zcf.makeInvitation(
          createAccounts,
          'Create accounts',
          undefined,
          harden({
            give: {},
            want: {},
            exit: M.any(),
          })
        );
      },
    },
  );

  return harden({ publicFacet });
};

/** @typedef {typeof start} OrcaSF */
