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

/**
 * Make a storage node for auxiliary data for a value on the board.
 *
 * @param {ERef<StorageNode>} chainStorage
 * @param {string} boardId
 */
const makeBoardAuxNode = async (chainStorage, boardId) => {
  console.log('creating board aux node');
  const boardAux = E(chainStorage).makeChildNode(BOARD_AUX);
  console.log('created board aux node');
  return E(boardAux).makeChildNode(boardId);
};

const publishBrandInfo = async (chainStorage, board, brand) => {
  console.log('publishing brand info');
  const [id, displayInfo] = await Promise.all([
    E(board).getId(brand),
    E(brand).getDisplayInfo(),
  ]);
  console.log('got brand id and display info');
  const node = await makeBoardAuxNode(chainStorage, id);
  const aux = marshalData.toCapData(harden({ displayInfo }));
  console.log('setting value in board aux node');
  await E(node).setValue(JSON.stringify(aux));
  console.log('published brand info');
};

/**
 * Core eval script to start contract
 *
 * @param {BootstrapPowers} permittedPowers
 */
export const startOrcaContract = async (
  permittedPowers,
  config,
) => {
  console.error('startOrcaContract()...');
  const {
    consume: { board, chainStorage, startUpgradable, zoe },
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
  const istIssuer = await istIssuerP;
  const istBrand = await istBrandP;

  const terms = {  };
  console.log('got terms for contract');

  console.log('getting orca installation');
  console.log(permittedPowers)
  console.log(permittedPowers.installation)
  console.log(permittedPowers.installation.consume)
  console.log("config")
  console.log(config)


  const {
    // must be supplied by caller or template-replaced
    bundleID = Fail`no bundleID`,
  } = config?.options?.[contractName] ?? {};


  console.log("bundleID before installContract: ", bundleID)
  const installation = await installContract(permittedPowers, {
    name: contractName,
    bundleID,
  });

  console.log("installation:")
  console.log(installation)

  await startContract(permittedPowers, {
    name: contractName,
    startArgs: {
      installation,
      issuerKeywordRecord: { },
      terms,
    },
    issuerNames: [],
  });

  console.log(contractName, '(re)started');
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

export const getManifestForOrca = ({ restoreRef }, { orcaRef }) => {
  console.log('getting manifest for orca');
  return harden({
    manifest: orcaManifest,
    installations: {
      orca: restoreRef(orcaRef),
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