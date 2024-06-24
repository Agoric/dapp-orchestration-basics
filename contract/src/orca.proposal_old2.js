// @ts-check
import { makeMarshal } from '@endo/marshal';
import { AmountMath } from '@agoric/ertp/src/amountMath.js';
import {
  installContract,
  startContract,
} from './platform-goals/start-contract.js';
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

// /**
//  * Make a storage node for auxiliary data for a value on the board.
//  *
//  * @param {ERef<StorageNode>} chainStorage
//  * @param {string} boardId
//  */
// const makeBoardAuxNode = async (chainStorage, boardId) => {
//   console.log('creating board aux node');
//   const boardAux = E(chainStorage).makeChildNode(BOARD_AUX);
//   console.log('created board aux node');
//   return E(boardAux).makeChildNode(boardId);
// };

// const publishBrandInfo = async (chainStorage, board, brand) => {
//   console.log('publishing brand info');
//   const [id, displayInfo] = await Promise.all([
//     E(board).getId(brand),
//     E(brand).getDisplayInfo(),
//   ]);
//   console.log('got brand id and display info');
//   const node = await makeBoardAuxNode(chainStorage, id);
//   const aux = marshalData.toCapData(harden({ displayInfo }));
//   console.log('setting value in board aux node');
//   await E(node).setValue(JSON.stringify(aux));
//   console.log('published brand info');
// };

/**
 * @param {BootstrapPowers & {installation: {consume: {stakeBld: Installation<import('./orca.contract.js').start>}}}} permittedPowers
 */
export const startOrcaContract = async (
  permittedPowers,
  // config,
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
  // const istIssuer = await istIssuerP;
  // const istBrand = await istBrandP;

  const terms = { };
  console.log('got terms for contract');

  console.log('getting orca installation');
  console.log(permittedPowers)
  console.log(permittedPowers.installation)
  console.log(permittedPowers.installation.consume)
  // console.log("config")
  // console.log(config)
  console.log("orcaInstallationP")
  console.log(orcaInstallationP)
  console.log("produceInstance")
  console.log(produceInstance)

  const VSTORAGE_PATH = 'orca-storage';
  
  // const storageNode = await makeStorageNodeChild(chainStorage, VSTORAGE_PATH);
  const storageNode = await E(chainStorage).makeChildNode("proposal");
  console.log("1")

  // NB: committee must only publish what it intended to be public
  const marshaller = await E(board).getPublishingMarshaller();
  console.log("2")
  // const [agoricNames, timerService, timerBrand] = await Promise.all([
  //   agoricNamesP,
  //   chainTimerServiceP,
  //   chainTimerServiceP.then(ts => E(ts).getTimerBrand()),
  // ]);
  console.log("3")
  console.log(agoricNamesP)
  // console.log(chainTimerServiceP)

    /** @type {StartUpgradableOpts<OrcaSF>} */
  const startOpts = {
    label: 'orca',
    installation: orcaInstallationP,
    issuerKeywordRecord: {},
    terms: {},
    privateArgs: {
      // agoricNames,
      // localchain: await localchain,
      timer: await chainTimerService,
      // timerBrand,
      storageNode,
      marshaller,
      orchestration: await orchestration
    },
  };
  console.log("4")

  const { instance } = await E(startUpgradable)(startOpts);
  console.log("5")
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