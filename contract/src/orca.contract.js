// import { makeTracer, StorageNodeShape } from '@agoric/internal';
import { makeTracer } from '@agoric/internal';
import { TimerServiceShape } from '@agoric/time';
import { prepareVowTools } from '@agoric/vow';
import { heapVowE as E } from '@agoric/vow/vat.js';

import {
  prepareRecorderKitMakers,
  provideAll,
} from '@agoric/zoe/src/contractSupport';
import { InvitationShape } from '@agoric/zoe/src/typeGuards.js';
import { makeDurableZone } from '@agoric/zone/durable.js';
import { M } from '@endo/patterns';
import { prepareCosmosOrchestrationAccount } from '@agoric/orchestration/src/exos/cosmosOrchestrationAccount.js';
import { prepareLocalChainAccountKit } from '@agoric/orchestration/src/exos/local-chain-account-kit.js';

import { makeChainHub } from '@agoric/orchestration/src/utils/chainHub.js';

// create a tracer for logging with the label 'OrchDev1'
const trace = makeTracer('OrchDev1');
export const StorageNodeShape = M.remotable('StorageNode');

/**
 * @import {Baggage} from '@agoric/vat-data';
 * @import {IBCConnectionID} from '@agoric/vats';
 * @import {TimerService} from '@agoric/time';
 * @import {ICQConnection, OrchestrationService} from '../types.js';
 */

/** @type {ContractMeta<typeof start>} */
export const meta = harden({
  // define the shapes of the private arguments for the contract
  privateArgsShape: {
    orchestration: M.remotable('orchestration'),
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
 * @param {ZCF<OrcaTerms>} zcf
 * @param {{
 *   orchestration: OrchestrationService;
 *   storageNode: StorageNode;
 *   marshaller: Marshaller;
 *   timer: TimerService;
 *   localchain: Remote<LocalChain>;
 * }} privateArgs
 * @param {Baggage} baggage
 */
export const start = async (zcf, privateArgs, baggage) => {

  // todo: define in terms for the contract
  const chainId = 'cosmoshub-4';
  const hostConnectionId = 'connection-1';
  const controllerConnectionId = 'connection-2';
  const bondDenom = 'uatom';
  const icqEnabled = true;

  trace('inside start function');
  trace("privateArgs", privateArgs);

  // destructure privateArgs to extract necessary services
  const { orchestration, marshaller, storageNode, timer, localchain } = privateArgs;
  trace('orchestration', orchestration);
  trace('marshaller', marshaller);
  trace('storageNode', storageNode);
  trace('timer', timer);
  trace('localchain', localchain);

  // create a durable zone for storing contract state
  const zone = makeDurableZone(baggage);
  trace('zone', zone);

  // provide all necessary nodes, creating them if they don't exist
  const { accountsStorageNode } = await provideAll(baggage, {
    accountsStorageNode: () => E(storageNode).makeChildNode('accounts'),
  });
  trace('accountsStorageNode', accountsStorageNode);

  // prepare recorder kit makers for recording state changes
  const { makeRecorderKit } = prepareRecorderKitMakers(baggage, marshaller);
  trace('makeRecorderKit', makeRecorderKit);

  // prepare vow tools for promise handling
  const vowTools = prepareVowTools(zone.subZone('vows'));
  trace('vowTools', vowTools);

  const makeLocalOrchestrationAccountKit = prepareLocalChainAccountKit(
    zone,
    makeRecorderKit,
    zcf,
    privateArgs.timerService,
    vowTools,
    makeChainHub(privateArgs.agoricNames),
  );

  // prepare the function to create cosmos orchestration accounts
  const makeCosmosOrchestrationAccount = prepareCosmosOrchestrationAccount(
    zone,
    makeRecorderKit,
    vowTools,
    zcf,
  );
  trace('makeCosmosOrchestrationAccount', makeCosmosOrchestrationAccount);

  async function makeLocalAccountKit() {
    trace('making local account kit');
    const account = await E(localchain).makeAccount();
    trace('local account', account);
    const address = await E(account).getAddress();
    trace('local account address', address);
    return makeLocalOrchestrationAccountKit({
      account,
      address: harden({
        address,
        addressEncoding: 'bech32',
        chainId: 'local',
      }),
      storageNode: privateArgs.storageNode,
    });
  }

  // function to create an account kit
  async function makeAccountKit() {
    trace('making account kit');

    // create an account using the orchestration service
    const account = await E(orchestration).makeAccount(
      chainId,
      hostConnectionId,
      controllerConnectionId,
    );
    trace('account', account);

    // conditionally provide ICQ connection based on icqEnabled flag
    const icqConnection = icqEnabled
      ? await E(orchestration).provideICQConnection(controllerConnectionId)
      : undefined;
    trace('icqConnection', icqConnection);

    // get the address of the created account
    const accountAddress = await E(account).getAddress();
    trace('account address', accountAddress);

    // create a storage node for the account using its address
    const accountNode = await E(accountsStorageNode).makeChildNode(
      accountAddress.address,
    );
    trace('account node', accountNode);

    // create a holder for the account with orchestration tools
    const holder = makeCosmosOrchestrationAccount(accountAddress, bondDenom, {
      account,
      storageNode: accountNode,
      icqConnection,
      timer,
    });
    trace('holder', holder);
    return holder;
  }

  // create the public facet of the contract
  const publicFacet = zone.exo(
    'OrcaFacet',
    M.interface('OrcaI', {
      makeAccount: M.callWhen().returns(M.remotable('ChainAccount')),
      makeAccountInvitationMaker: M.callWhen().returns(InvitationShape),
    }),
    {
      // method to create an account and return its holder
      async makeAccount() {
        trace('makeAccount');
        const { holder } = await makeLocalAccountKit();
        trace('holder address', holder.accountAddress);
        trace('holder', holder);
        return holder;
      },

      // method to create an invitation maker for creating accounts
      makeAccountInvitationMaker() {
        trace('makeCreateAccountInvitation');
        return zcf.makeInvitation(
          // offer handler
          async seat => {
            seat.exit();
            const holder = await makeAccountKit();
            trace('holder', holder);
            return holder.asContinuingOffer();
          },
          // description
          'wantStakingAccount',
          undefined, // custom details
          undefined, // proposal shape
        );
      },
    },
  );

  // return the public facet of the contract
  return { publicFacet };
};

/** @typedef {typeof start} OrcaSF */