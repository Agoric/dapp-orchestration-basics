// @ts-check
import { allValues } from './objectTools.js';
import {
  AmountMath,
  installContract,
  startContract,
} from './platform-goals/start-contract.js';

import { E } from '@endo/far';

const { Fail } = assert;

const pathSegmentPattern = /^[a-zA-Z0-9_-]{1,100}$/;

/** @type {(name: string) => void} */
const assertPathSegment = name => {
  pathSegmentPattern.test(name) ||
    Fail`Path segment names must consist of 1 to 100 characters limited to ASCII alphanumerics, underscores, and/or dashes: ${name}`;
};
harden(assertPathSegment);

const contractName = 'simpleDAO';

export const makeTerms = (daoTokensBrand, daoTokensUnits, membershipBrand) => {
  return {
    DaoTerms: {
      DaoToken: AmountMath.make(daoTokensBrand, daoTokensUnits),
      Membership: AmountMath.make(membershipBrand, 10n),
    }
  };
};


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
export const startDaoContract = async (
  powers,
  config,
) => {
  console.log('core eval for', contractName);

  const {
    // must be supplied by caller or template-replaced
    bundleID = Fail`no bundleID`,
  } = config?.options?.[contractName] ?? {};

  
  const {
    consume: { board, chainStorage, startUpgradable },
    installation: {
      consume: { [contractName]: committee },
    },
    instance: {
      produce: { [contractName]: produceInstance },
    },
  } = powers;

  const installation = await installContract(powers, {
    name: contractName,
    bundleID,
  });


  //basic terms
  const terms = makeTerms("DaoToken", 100n, "Membership");

  const committeesNode = await E(chainStorage).makeChildNode("dao-proposals");
  const storageNode = await E(committeesNode).makeChildNode("proposal");
  const marshaller = await E(board).getPublishingMarshaller();
  
  
  const privateArgs = {
    storageNode,
    marshaller,
  };

  const started = await startContract(powers, {
    name: contractName,
    startArgs: {
      installation,
      terms,
    },
    issuerNames: ['DaoToken', 'Membership'],
  }, privateArgs);

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
  },
  installation: {
    consume: { [contractName]: true },
    produce: { [contractName]: true },
  },
  instance: { produce: { [contractName]: true } },
  // permitting brands
  issuer: { consume: { IST: true, Membership: true, DaoToken: true }, produce: { Membership: true, DaoToken: true} },
  brand: { consume: { IST: true, Membership: true, DaoToken: true }, produce: { Membership: true, DaoToken: true} },
});

export const main = startDaoContract;
