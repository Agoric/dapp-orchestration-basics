/* eslint-disable -- FIXME */
import {
  installContract,
  startContract,
} from './platform-goals/start-contract.js';

import { makeTracer } from '@agoric/internal';
import { E } from '@endo/far';

/// <reference types="@agoric/vats/src/core/core-eval-env"/>
/// <reference types="@agoric/vats/src/core/types-ambient"/>
/**
 * @import {AssetKind, Brand, Issuer, Purse} from '@agoric/ertp/src/types.js';
 */

const { Fail } = assert;

const contractName = 'ORCA';

const trace = makeTracer('StartOrca', true);

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
export const startDaoContract = async (powers, config) => {
  trace('core eval for', contractName);

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
      // orchestration,
      chainTimerService,
    },
    installation: {
      // @ts-expect-error ORCA not known
      consume: { [contractName]: committee },
    },
    instance: {
      // @ts-expect-error ORCA not known
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

  const mainNode = await E(chainStorage).makeChildNode('orca');
  const storageNode = await E(mainNode).makeChildNode('state');
  const marshaller = await E(board).getPublishingMarshaller();

  const privateArgs = {
    storageNode,
    marshaller,
    timer: await chainTimerService,
  };

  const started = await startContract(powers, {
    name: contractName,
    startArgs: {
      installation,
      terms,
      privateArgs,
    },
    issuerNames: [],
  });

  trace(contractName, '(re)started');
  produceInstance.resolve(started.instance);
};

// need more details on permit
/** @type { import("@agoric/vats/src/core/lib-boot.js").BootstrapManifestPermit } */
export const permit = harden({
  consume: {
    agoricNames: true,
    brandAuxPublisher: true,
    startUpgradable: true,
    zoe: true,
    board: true,
    chainStorage: true,
    orchestration: true,
    chainTimerService: true,
  },
  installation: {
    consume: { [contractName]: true },
    produce: { [contractName]: true },
  },
  instance: { produce: { [contractName]: true } },
  // permitting brands
  issuer: { consume: { IST: true }, produce: {} },
  brand: { consume: { IST: true }, produce: {} },
});

export const main = startDaoContract;
