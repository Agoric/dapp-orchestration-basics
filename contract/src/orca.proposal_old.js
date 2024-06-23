// @ts-check
import { allValues } from './objectTools.js';
import {
  AmountMath,
  installContract,
  startContract,
} from './platform-goals/start-contract.js';

// import { E } from '@endo/far';
import { makeTracer } from '@agoric/internal';


const { Fail } = assert;

const pathSegmentPattern = /^[a-zA-Z0-9_-]{1,100}$/;

// /** @type {(name: string) => void} */
// const assertPathSegment = name => {
//   pathSegmentPattern.test(name) ||
//     Fail`Path segment names must consist of 1 to 100 characters limited to ASCII alphanumerics, underscores, and/or dashes: ${name}`;
// };
// harden(assertPathSegment);

const contractName = 'ORCA';



// const trace = makeTracer('StartOrca', true);


/**
 * Core eval script to start contract
 *
 * @param {BootstrapPowers } powers
 * @param {*} config
 *
 * @typedef {{
 *   brand: PromiseSpaceOf<{ DaoToken: Brand }>;
 *   issuer: PromiseSpaceOf<{ DaoToken: Issuer }>;
 *   instance: PromiseSpaceOf<{ Dao: Instance }>
 * }} DaoSpace
 */
export const startOrcaContract = async (
  powers,
  config,
) => {
  console.log('core eval for', contractName);
  console.log("core eval powers:")
  console.log(powers)
  const {
    // must be supplied by caller or template-replaced
    bundleID = Fail`no bundleID`,
  } = config?.options?.[contractName] ?? {};

  
  const {
    consume: { 
      agoricNames,
      board, 
      chainStorage, 
      startUpgradable,
      orchestration,
      chainTimerService,
    },
    installation: {
      consume: { [contractName]: committee },
    },
    instance: {
      produce: { [contractName]: produceInstance },
    },
  } = powers;

  // trace('start Orca', {});

  const installation = await installContract(powers, {
    name: contractName,
    bundleID,
  });


  //basic terms
  const terms = {};

  const mainNode = await E(chainStorage).makeChildNode("orca");
  const storageNode = await E(mainNode).makeChildNode("state");
  const marshaller = await E(board).getPublishingMarshaller();
  
  
  // const privateArgs = {
  //   storageNode,
  //   marshaller,
  // };

  const started = await startContract(powers, {
    name: contractName,
    startArgs: {
      installation,
      terms,
    },
    issuerNames: [],
  }, 
  // privateArgs
  { 
    privateArgs: {
    orchestration: await orchestration,
    storageNode,
    marshaller,
    timer: await chainTimerService,
    }
  }
  );

  console.log(contractName, '(re)started');
  produceInstance.resolve(started.instance);
};

// need more details on permit
/** @type { import("@agoric/vats/src/core/lib-boot").BootstrapManifestPermit } */
export const permit = harden({
  consume: {
    agoricNames: true,
    brandAuxPublisher: true,
    startUpgradable: true, 
    zoe: true,
    board: true,
    chainStorage: true,
    orchestration: true,
    chainTimerService: true
  },
  installation: {
    consume: { [contractName]: true },
    produce: { [contractName]: true },
  },
  instance: { produce: { [contractName]: true } },
  // permitting brands
  issuer: { consume: { IST: true }, produce: { } },
  brand: { consume: { IST: true  }, produce: { } },
});

export const main = startOrcaContract;
