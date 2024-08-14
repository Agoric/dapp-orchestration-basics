/**
 * @file Primarily a testing fixture, but also serves as an example of how to
 *   leverage basic functionality of the Orchestration API with async-flow.
 */
import { InvitationShape } from '@agoric/zoe/src/typeGuards.js';
import { M } from '@endo/patterns';
import { preparePortfolioHolder } from '@agoric/orchestration/src/exos/portfolio-holder-kit.js';
import { withOrchestration } from '@agoric/orchestration/src/utils/start-helper.js';
import * as flows from '@agoric/orchestration/src/examples/basic-flows.flows.js';


/**
 * @import {Zone} from '@agoric/zone';
 * @import {OrchestrationPowers, OrchestrationTools} from '@agoric/orchestration/src/utils/start-helper.js';
 */

/**
 * @param zcf
 * @param {OrchestrationPowers & {
 *   marshaller;
 * }} _privateArgs
 * @param {Zone} zone
 * @param {OrchestrationTools} tools
 */
const contract = async (
  zcf,
  _privateArgs,
  zone,
  { orchestrateAll },
) => {

  const orchFns = orchestrateAll(flows, {});

  const publicFacet = zone.exo(
    'Basic Flows Public Facet',
    M.interface('Basic Flows PF', {
      makeOrchAccountInvitation: M.callWhen().returns(InvitationShape),
    }),
    {
      makeOrchAccountInvitation() {
        return zcf.makeInvitation(
          orchFns.makeOrchAccount,
          'Make an Orchestration Account',
        );
      },
    },
  );

  return { publicFacet };
};

// @ts-ignore
export const start = withOrchestration(contract);

/** @typedef {typeof start} BasicFlowsSF */
