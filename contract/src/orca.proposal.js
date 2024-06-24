// @ts-check
import { makeMarshal } from '@endo/marshal';
// import { AmountMath } from '@agoric/ertp/src/amountMath.js';
// import {
//   installContract,
//   startContract,
// } from './platform-goals/start-contract.js';
const { entries, fromEntries } = Object;


console.warn('start proposal module evaluating');

const { Fail } = assert;

const BOARD_AUX = 'boardAux';
const contractName = 'orca';


const marshalData = makeMarshal(_val => Fail`data only`);

const IST_UNIT = 1_000_000n;
const CENT = IST_UNIT / 100n;

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
 * @param {BootstrapPowers & {installation: {consume: {stakeBld: Installation<import('./orca.contract.js').start>}}}} permittedPowers
 */
export const startOrcaContract = async (
  permittedPowers,
  config,
) => {
  console.error('startOrcaContract()...');
  const {
    consume: {
      agoricNames: agoricNamesP,
      board,
      chainTimerService,
      orchestration,
      startUpgradable,
      localchain,
      chainStorage,
    },
    brand: {
      consume: { IST: istBrandP },
      produce: { },
    },
    issuer: {
      consume: { IST: istIssuerP },
      produce: { },
    },
    installation: {
      consume: { orca: orcaInstallationP },
    },
    instance: {
      produce: { orca: produceInstance },
    },
  } = permittedPowers;


  console.log('getting ist issuer and brand');
  

  const terms = { };
  console.log('got terms for contract');

  console.log('getting orca installation');
  console.log(permittedPowers)
  console.log(permittedPowers.installation)
  console.log(permittedPowers.installation.consume)
  console.log("config")
  console.log(config)
  console.log("orcaInstallationP")
  console.log(orcaInstallationP)
  console.log("produceInstance")
  console.log(produceInstance)

  

  // agoricNames gets updated each time; the promise space only once XXXXXXX
  const installation = await orcaInstallationP;
  console.log("installation")
  console.log(installation)

  const { instance } = await E(startUpgradable)({
    installation,
    issuerKeywordRecord: {},
    label: 'orca',
    terms,
  });
  console.log("instance")
  console.log(instance)
  console.log('CoreEval script: started contract', instance);
  const {
    brands: {},
    issuers: {},
  } = await E(zoe).getTerms(instance);

  // console.log('CoreEval script: share via agoricNames:', brand);

  produceInstance.reset();
  produceInstance.resolve(instance);
  console.log('orca (re)started');

};

/** @type { import("@agoric/vats/src/core/lib-boot").BootstrapManifest } */
const orcaManifest = {
  [startOrcaContract.name]: {
    consume: {
      agoricNames: true,
      brandAuxPublisher: true,
      board: true,
      chainStorage: true,
      startUpgradable: true,
      zoe: true,
      chainTimerService: true,
      localchain: true,
    },
    installation: {
      consume: { orca: true },
      produce: { orca: true },
    },
    issuer: { consume: { IST: true }, produce: { } },
    brand: { consume: { IST: true }, produce: { } },
    instance: { produce: { orca: true } },
  },
};
harden(orcaManifest);

export const getManifestForOrca = ({ restoreRef }, { installKeys }) => {
  console.log('getting manifest for orca');
  console.log("installKeys")
  console.log(installKeys)
  return harden({
    manifest: orcaManifest,
    installations: {
      orca: restoreRef(installKeys),
    },
  });
};

export const permit = harden({
  consume: {
    agoricNames: true,
    brandAuxPublisher: true,
    board: true,
    chainStorage: true,
    startUpgradable: true,
    zoe: true,
    localchain: true,
    chainTimerService: true,
    orchestration: true,
  },
  installation: {
    consume: { orca: true },
    produce: { orca: true },
  },
  issuer: { consume: { IST: true }, produce: { } },
  brand: { consume: { IST: true }, produce: { } },
  instance: { produce: { orca: true } },
});

export const main = startOrcaContract;