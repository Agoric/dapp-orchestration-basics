import { E } from '@endo/far';
import { installContract } from './platform-goals/start-contract.js';
import { makeTracer } from './tools/debug.js';
// import '@agoric/orchestration/src/types.js';
// import '@agoric/vats/src/types.js';
// import '@agoric/vats/src/localchain.js';
// import '@agoric/vow/src/types.js';

/// <reference types="@agoric/vats/src/core/types-ambient"/>
// import { atomicTransfer } from '@agoric/zoe/src/contractSupport/index.js';
/// <reference types="@agoric/zoe/src/contractFacet/types-ambient"/>

/**
 * @import {ERef} from '@endo/far';
 * @import {BootstrapManifest} from '@agoric/vats/src/core/lib-boot.js';
 * @import {OrchestrationPowers} from './exos/cosmos-interchain-service.js';
 * @import {Remote} from '@agoric/vow';
 * @import {OrcaSF} from './orca.contract.js';
 */

/**
 * * @typedef {import('./orca.contract.js').OrcaSF} OrcaSF
 */

/**
 * @typedef {import('@agoric/vow').Remote<import('@agoric/vats/src/localchain.js').LocalChain>} LocalChain
 */

const trace = makeTracer('OrCE');
const { entries, fromEntries } = Object;

trace('start proposal module evaluating');

const { Fail } = assert;

const contractName = 'orca';

/**
 * Given a record whose values may be promise, return a promise for a record with all the values resolved.
 *
 * @type { <T extends Record<string, ERef<any>>>(obj: T) => Promise<{ [K in keyof T]: Awaited<T[K]>}> }
 */
export const allValues = async obj => {
  const es = await Promise.all(
    entries(obj).map(([k, vp]) => E.when(vp, v => [k, v])),
  );
  return fromEntries(es);
};

/**
 * @param {BootstrapPowers & {installation: {consume: {orca: Installation<import('./orca.contract.js').start>}}}} permittedPowers
 * @param {{options: {[contractName]: {bundleID: string}}}} config
 */
export const startOrcaContract = async (permittedPowers, config) => {
  trace('startOrcaContract()... 0.0.93');
  console.log(permittedPowers);
  console.log(config);
  const {
    consume: {
      agoricNames,
      board,
      chainTimerService,
      localchain,
      chainStorage,
      cosmosInterchainService,
      startUpgradable,
    },
    installation: {
      consume: { orca: orcaInstallation },
    },
    instance: {
      // @ts-expect-error not a WellKnownName
      produce: { orca: produceInstance },
    },
  } = permittedPowers;

  trace('config', config);
  trace('permittedPowers', permittedPowers);
  trace('produceInstance:');
  trace('orcaInstallation', orcaInstallation);

  // NOTE: during contract tests, orcaInstallation doesn't provide the installation, config is also undefined during actual deployment
  // this ensures both work, with config, and without. Revisit this to see if there is a way to coerce this without conditional check
  let installation;
  if (config.options == undefined) {
    trace('config is undefined, assigning installation to orcaInstallation');
    installation = await orcaInstallation;
  } else {
    trace('config is NOT undefined, using config.options');
    installation = await installContract(permittedPowers, {
      name: contractName,
      bundleID: config.options[contractName].bundleID,
    });
  }

  console.log('installation:');
  console.log(installation);

  console.log('permittedPowers');
  console.log(permittedPowers);
  console.log('from inside startOrcaContract:', produceInstance);

  console.log(cosmosInterchainService);
  console.log(agoricNames); // make storage node
  console.log('chainStorage');
  console.log(chainStorage);
  const storageNode = await E(chainStorage).makeChildNode('orca');

  console.log(storageNode);
  console.log('DONE MAKING NODES v0.3');
  const marshaller = await E(board).getPublishingMarshaller();
  console.log(marshaller);

  /** @type {StartUpgradableOpts<OrcaSF>} **/
  const startOpts = {
    label: 'orca',
    installation,
    terms: undefined,
    privateArgs: {
      localchain: await localchain,
      // localchain: await E(localchain),
      orchestrationService: await cosmosInterchainService,
      storageNode,
      timerService: await chainTimerService,
      agoricNames: await agoricNames,
      marshaller,
    },
  };

  trace('startOpts', startOpts);
  const { instance } = await E(startUpgradable)(startOpts);

  trace(contractName, '(re)started WITH RESET');
  produceInstance.reset();
  produceInstance.resolve(instance);
};

/** @type {BootstrapManifest} */
const orcaManifest = {
  [startOrcaContract.name]: {
    consume: {
      agoricNames: true,
      // brandAuxPublisher: true,
      board: true,
      chainStorage: true,
      startUpgradable: true,
      zoe: true,
      localchain: true,
      chainTimerService: true,
      cosmosInterchainService: true,
    },
    installation: {
      produce: { orca: true },
      consume: { orca: true },
    },
    instance: {
      produce: { orca: true },
    },
  },
};
harden(orcaManifest);

export const getManifestForOrca = ({ restoreRef }, { installKeys }) => {
  trace('getting manifest for orca');
  trace('installKeys');
  trace(installKeys);
  trace('restoreRef');
  trace(restoreRef);
  return harden({
    manifest: orcaManifest,
    installations: {
      [contractName]: restoreRef(installKeys[contractName]),
    },
  });
};

export const permit = harden({
  consume: {
    agoricNames: true,
    board: true,
    chainStorage: true,
    startUpgradable: true,
    zoe: true,
    localchain: true,
    chainTimerService: true,
    cosmosInterchainService: true,
  },
  installation: {
    consume: { orca: true },
    produce: { orca: true },
  },
  instance: { produce: { orca: true } },
  brand: { consume: { BLD: true, IST: true }, produce: {} },
  issuer: { consume: { BLD: true, IST: true }, produce: {} },
});

export const main = startOrcaContract;
