import { InvitationShape } from '@agoric/zoe/src/typeGuards.js';
import { M, mustMatch } from '@endo/patterns';
import { provideOrchestration } from '@agoric/orchestration/src/utils/start-helper.js';
import { makeTracer } from '@agoric/internal';
const trace = makeTracer('OrchDev1');

/**
 * @import {Baggage} from '@agoric/vat-data';
 * @import {Orchestrator} from '@agoric/orchestration';
 * @import {OrchestrationPowers} from '@agoric/orchestration/src/utils/start-helper.js';
 */


/**
 * Create an account on a Cosmos chain and return a continuing offer with
 * invitations makers for Delegate, WithdrawRewards, Transfer, etc.
 *
 * @param {Orchestrator} orch
 * @param {undefined} _ctx
 * @param {ZCFSeat} seat
 * @param {{ chainName: string }} offerArgs
 */
const createAccountsFn = async (orch, _ctx, seat, { chainName }) => {
  const { give } = seat.getProposal();
  trace('version 0.1.34');
  trace('give');
  trace(give);
  trace('inside createAccounts');
  trace('orch');
  trace(orch);
  trace('seat');
  trace(seat);
  trace(chainName)
  // trace("offerArgs")
  // trace(offerArgs) // conversion throw because undefined for now
  // trace('zcf');
  // trace(zcf);
  seat.exit();
  try {
    // const chain = await E(orch).getChain('osmosis'); //host code vs guest
    const chain = await orch.getChain('osmosis');
    trace('chain object');
    trace(chain);

    // const info = await E(chain).getChainInfo();
    const info = await chain.getChainInfo();
    trace('chain info', info);

    const chainAccount = await chain.makeAccount();
    // const chainAccount = await E(chain).makeAccount();
    console.log("chainAccount")
    console.log(chainAccount)
    return await chainAccount.asContinuingOffer();

  } catch (error) {
    console.error('Error in createAccounts:', error);
  }
};

/**
 * @param {ZCF} zcf
 * @param {OrchestrationPowers & {
 *   marshaller: Marshaller;
 * }} privateArgs
 * @param {Baggage} baggage
 */
export const start = async (zcf, privateArgs, baggage) => {
  // const zone = makeDurableZone(baggage);
  trace('inside start function: v1.0.83');
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
  const { orchestrate, zone } = provideOrchestration(
    zcf,
    baggage,
    privateArgs,
    privateArgs.marshaller,
  );

  /** @type {OfferHandler} */
  const makeOrchAccount = orchestrate(
    'makeOrchAccount',
    undefined,
    createAccountsFn,
  );

  const publicFacet = zone.exo(
    'Orca Public Facet',
    M.interface('Orca PF', {
      makeAccountInvitation: M.callWhen().returns(InvitationShape),
    }),
    {
      makeAccountInvitation() {
        return zcf.makeInvitation(
          makeOrchAccount,
          'Make an Orchestration Account',
        );
      },
    },
  );

  return { publicFacet };
};

/** @typedef {typeof start} OrcaSF */
