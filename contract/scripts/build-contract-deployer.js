/**
 * @file Permission Contract Deployment builder
 *
 * Usage:
 *   agoric run build-contract-deployer.js
 */

import { makeHelpers } from '@agoric/deploy-script-support';
import { getManifestForOrca } from '../src/orca.proposal.js';

console.log("running")
/** @type {import('@agoric/deploy-script-support/src/externalTypes.js').ProposalBuilder} */
export const orcaProposalBuilder = async ({ publishRef, install }) => {
  return harden({
    sourceSpec: '../src/orca.proposal.js',
    getManifestCall: [
        getManifestForOrca.name,
      {
        orcaRef: publishRef(
          install(
            '../src/orca.contract.js',
            '../bundles/bundle-orca.js',
            {
              persist: true,
            },
          ),
        ),
      },
    ],
  });
};

/** @type {DeployScriptFunction} */
export default async (homeP, endowments) => {
  console.log("running default in builder")
  const { writeCoreProposal } = await makeHelpers(homeP, endowments);
  console.log("writeCoreProposal")
  console.log(writeCoreProposal)
  await writeCoreProposal('start-orca', orcaProposalBuilder);
};