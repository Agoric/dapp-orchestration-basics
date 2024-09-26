import { makeHelpers } from '@agoric/deploy-script-support';
import { startOrcaContract } from '../../src/orca.proposal.js';

/** @type {import('@agoric/deploy-script-support/src/externalTypes.js').CoreEvalBuilder} */
export const defaultProposalBuilder = async ({ publishRef, install }) => {
  return harden({
    sourceSpec: '../../src/orca.proposal.js',
    getManifestCall: [
      'getManifestForOrca',
      {
        installKeys: {
          orca: publishRef(install('../../src/orca.contract.js')),
        },
      },
    ],
  });
};

export default async (homeP, endowments) => {
  const { writeCoreEval } = await makeHelpers(homeP, endowments);
  await writeCoreEval(startOrcaContract.name, defaultProposalBuilder);
};
