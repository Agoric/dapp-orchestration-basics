// @ts-check
// borrowed from https://github.com/Agoric/agoric-sdk/blob/master/packages/inter-protocol/test/supports.js
import { E, Far } from '@endo/far';
import { createRequire } from 'node:module';

import '@agoric/vats/src/core/types-ambient.js';

/**
 * @import {ERef} from '@endo/far';
 */

const nodeRequire = createRequire(import.meta.url);
export const assets = {
  binaryVoteCounter: nodeRequire.resolve(
    '@agoric/governance/src/binaryVoteCounter.js',
  ),
  committee: nodeRequire.resolve('@agoric/governance/src/committee.js'),
  contractGovernor: nodeRequire.resolve(
    '@agoric/governance/src/contractGovernor.js',
  ),
  committeeCharter: nodeRequire.resolve(
    '@agoric/inter-protocol/src/econCommitteeCharter.js',
  ),
  puppetContractGovernor: nodeRequire.resolve(
    '@agoric/governance/tools/puppetContractGovernor.js',
  ),
  invitationMakerContract: nodeRequire.resolve(
    '@agoric/zoe/src/contracts/automaticRefund.js',
  ),
};

export const installCommitteeContract = async (zoe, produce, bundleCache) => {
  const committeeBundle = await bundleCache.load(assets.committee, 'committee');

  produce.committee.resolve(E(zoe).install(committeeBundle));
};

/**
 * Install governance contracts, with a "puppet" governor for use in tests.
 *
 * @param {ERef<ZoeService>} zoe
 * @param {BootstrapPowers['installation']['produce']} produce
 * @param {BundleCache} bundleCache
 *
 * @typedef {Awaited<ReturnType<typeof import('@endo/bundle-source/cache.js').makeNodeBundleCache>>} BundleCache
 */
export const installPuppetGovernance = async (zoe, produce, bundleCache) => {
  await installCommitteeContract(zoe, produce, bundleCache);
  produce.contractGovernor.resolve(
    E(zoe).install(await bundleCache.load(assets.puppetContractGovernor)),
  );
  // ignored by puppetContractGovernor but expected by something
  produce.binaryVoteCounter.resolve(
    E(zoe).install(await bundleCache.load(assets.binaryVoteCounter)),
  );
};
// a source of arbitrary invitations
export const mockElectorate = async (zoe, bundleCache) => {
  const installation = await E(zoe).install(
    await bundleCache.load(assets.invitationMakerContract),
  );
  const arbInstance = await E(zoe).startInstance(installation);
  const committeeCreatorFacet = Far('Electorate CF', {
    getPoserInvitation: async () => E(arbInstance.publicFacet).makeInvitation(),
  });
  return { creatorFacet: committeeCreatorFacet };
};

export const installGovContracts = async (t, powers, bundleCache) => {
  const { zoe } = powers.consume;
  for await (const [name, asset] of Object.entries({
    contractGovernor: assets.contractGovernor,
    binaryVoteCounter: assets.binaryVoteCounter,
    committee: assets.committee,
    econCommitteeCharter: assets.committeeCharter,
  })) {
    t.log('installation:', name);
    powers.installation.produce[name].resolve(
      E(zoe).install(await bundleCache.load(asset)),
    );
  }
};
