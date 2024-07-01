// import { makeTracer, StorageNodeShape } from '@agoric/internal';
import { Far } from '@endo/far';
import { makeTracer } from '@agoric/internal';
import { TimerServiceShape } from '@agoric/time';
import { prepareVowTools } from '@agoric/vow';
import { heapVowE as E } from '@agoric/vow/vat.js';
import { deeplyFulfilled } from '@endo/marshal';

import {
  prepareRecorderKitMakers,
  provideAll,
} from '@agoric/zoe/src/contractSupport';
import { InvitationShape } from '@agoric/zoe/src/typeGuards.js';
import { makeDurableZone } from '@agoric/zone/durable.js';
import { M, mustMatch } from '@endo/patterns';
// import { prepareCosmosOrchestrationAccount } from '@agoric/orchestration/src/exos/cosmos-orchestration-account.js';
// import { prepareLocalChainAccountKit } from '@agoric/orchestration/src/exos/local-chain-account-kit.js';

import { prepareChainAccountKit } from '@agoric/orchestration/src/exos/chain-account-kit.js';
// import { makeChainHub } from '@agoric/orchestration/src/utils/chain-hub.js';



///// sendanywhere:
import { withdrawFromSeat } from '@agoric/zoe/src/contractSupport/zoeHelpers.js';
import { AmountShape } from '@agoric/ertp';
import { CosmosChainInfoShape } from '@agoric/orchestration/src/typeGuards.js';
import { provideOrchestration } from './utils/start-helper.js';


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
 *   agoricNames: Remote<NameHub>;
 *   orchestration: OrchestrationService;
 *   storageNode: StorageNode;
 *   marshaller: Marshaller;
 *   timer: TimerService;
 *   localchain: Remote<LocalChain>;
 * }} privateArgs
 * @param {Baggage} baggage
 */
export const start = async (zcf, privateArgs, baggage) => {

  trace('inside start function: v1.0.47');
  trace("privateArgs", privateArgs);

  // destructure privateArgs to extract necessary services
  const { orchestration, marshaller, storageNode, timer, localchain, agoricNames } = privateArgs;
  trace('orchestration: ', orchestration);
  trace('marshaller: ', marshaller);
  trace('storageNode: ', storageNode);
  trace('timer: ', timer);
  trace('localchain: ', localchain);
  trace('agoricNames: ', agoricNames);

  // provide all necessary nodes, creating them if they don't exist
  const { accountsStorageNode } = await provideAll(baggage, {
    accountsStorageNode: () => E(storageNode).makeChildNode('accounts'),
  });
  trace('accountsStorageNode', accountsStorageNode);

  // prepare recorder kit makers for recording state changes
  // const { makeRecorderKit } = prepareRecorderKitMakers(baggage, marshaller);
  // trace('makeRecorderKit', makeRecorderKit);

  // const { chainHub, orchestrate, zone } = provideOrchestration(
  // const { orchestrate, chainHub, vowTools, zone } = provideOrchestration(
  const { chainHub, orchestrate, vowTools, zone } = provideOrchestration(
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

  console.log("Got an orchestrate object 0.52.91")
  console.log(orchestrate)
  

  // const chains = await chainHub.getChainsAndConnection()
  // console.log("chains from chainhub")
  // console.log(chains)

  /**
   * handler function for creating and managing accounts
   * @param {Orchestrator} orch
   * @param {object} ctx
   * @param {ZCF} ctx.zcf
   * @param {ZCFSeat} seat
   * @param {object} offerArgs
   */
  // const createAccounts = async (orch, { zcf }, seat, offerArgs) => {
  /** @type {OfferHandler} */
  const createAccounts = orchestrate(
    'LSTTia',
    { zcf },
    // eslint-disable-next-line no-shadow -- this `zcf` is enclosed in a membrane
    // async (/** @type {Orchestrator} */ orch, { zcf }, _seat, _offerArgs) => {
    async (/** @type {Orchestrator} */ orch, { zcf }, seat, offerArgs) => {
      // TODO:
      // mustMatch(offerArgs, harden({ chainName: M.scalar(), destAddr: M.string() }));
      const { give } = seat.getProposal();
      trace("version 0.1.4")
      trace("give")
      trace(give)
      trace("inside createAccounts")
      trace("orch")
      trace(orch)
      trace("seat")
      trace(seat)
      // trace("offerArgs")
      // trace(offerArgs) // conversion throw because undefined for now
      trace("zcf")
      trace(zcf)
      
      // const chain = await orch.getChain('osmosis');
      // const chain = await E(orch).getChain('osmosis');
      try {
        const chain = await E(orch).getChain('osmosis');
        trace("chain");
        trace(chain);
  
        const info = await E(chain).getChainInfo();
        trace('info', info);
  
        const localChain = await E(orch).getChain('agoric');
        trace("localChain");
        trace(localChain);
  
        const [chainAccount, localAccount] = await Promise.all([
          E(chain).makeAccount(),
          E(localChain).makeAccount(),
        ]);
  
        const chainAddress = await E(chainAccount).getAddress();
        trace("chainAddress");
        trace(chainAddress);
  
        const localAddress = await E(localAccount).getAddress();
        trace("localAddress");
        trace(localAddress);
        
      } catch (error) {
        console.error('Error in createAccounts:', error);
      }
      // const payments = await withdrawFromSeat(zcf, seat, give);
      // console.log("paymentss")
      // console.log(payments)

      // await deeplyFulfilled(
      //   objectMap(payments, payment =>
      //     localAccount.deposit(payment),
      //   ),
      // );

      // seat.exit();

      // await localAccount
      // .transferSteps(give.Stable, transferMsg)
      // .then(_txResult =>
      //   chainAccount.delegate(offerArgs.validator, offerArgs.staked),
      // )
      // .catch(e => console.error(e));
    },
  );

  // const accountHandler = orchestrate('OrcaAccountHandler', { zcf }, createAccounts);

  const makeAccountInvitation = () =>
    zcf.makeInvitation(
      createAccounts,
      'Create and manage accounts',
      undefined,
      harden({
        give: {},
        want: {}, // XXX ChainAccount Ownable?
        exit: M.any(),
      }),
    );
    

  const publicFacet = Far('OrcaFacet', {
    makeAccountInvitation,
  });

  return harden({ publicFacet });
};

/** @typedef {typeof start} OrcaSF */