console.log('sane');

import { makeHelpers } from '@agoric/deploy-script-support';
import { startOrcaContract } from '../../src/orca.proposal.js';
import { exec } from 'child_process';

const runCommand = command => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
      } else if (stderr) {
        reject(`Stderr: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
};

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
