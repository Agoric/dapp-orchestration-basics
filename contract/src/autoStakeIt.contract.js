import {
  EmptyProposalShape,
  InvitationShape,
} from '@agoric/zoe/src/typeGuards.js';
import { M } from '@endo/patterns';
import { prepareChainHubAdmin } from '@agoric/orchestration/src/exos/chain-hub-admin.js';
import { preparePortfolioHolder } from '@agoric/orchestration/src/exos/portfolio-holder-kit.js';
// import { withOrchestration } from '@agoric/orchestration/src/utils/start-helper.js';
import { withOrchestration } from '@agoric/orchestration/src/utils/start-helper.js';
import { prepareStakingTap } from './autoStakeIt-tap-kit.js';
import * as flows from './autoStakeIt.flows.js';

/**
 * @import {Zone} from '@agoric/zone';
 * @import {OrchestrationPowers, OrchestrationTools} from '@agoric/orchestration/src/utils/start-helper.js';
 * @import { Marshaller } from '@agoric/internal/src/lib-chainStorage.js';
 */

/**
 * autoStakeIt allows users to to create an auto-forwarding address that
 * transfers and stakes tokens on a remote chain when received.
 *
 * To be wrapped with `withOrchestration`.
 *
 * @param {ZCF} zcf
 * @param {OrchestrationPowers & {
 *   marshaller: Marshaller;
 * }} _privateArgs
 * @param {Zone} zone
 * @param {OrchestrationTools} tools
 */
const contract = async (
  zcf,
  _privateArgs,
  zone,
  { chainHub, orchestrateAll, vowTools },
) => {
  const makeStakingTap = prepareStakingTap(
    zone.subZone('stakingTap'),
    vowTools,
  );
  const makePortfolioHolder = preparePortfolioHolder(
    zone.subZone('portfolio'),
    vowTools,
  );

  const { makeAccounts } = orchestrateAll(flows, {
    makeStakingTap,
    makePortfolioHolder,
    chainHub,
  });

  const publicFacet = zone.exo(
    'autoStakeIt Public Facet',
    M.interface('autoStakeIt Public Facet', {
      makeAccountsInvitation: M.callWhen().returns(InvitationShape),
    }),
    {
      makeAccountsInvitation() {
        return zcf.makeInvitation(
          makeAccounts,
          'Make Accounts',
          undefined,
          EmptyProposalShape,
        );
      },
    },
  );

  const creatorFacet = prepareChainHubAdmin(zone, chainHub);

  return { publicFacet, creatorFacet };
};

export const start = withOrchestration(contract);
harden(start);

/** @typedef {typeof start} AutoStakeItSF */
