// @ts-check
// import { makeMarshal } from '@endo/marshal';
// import { AmountMath } from '@agoric/ertp/src/amountMath.js';
// change for tests?
import { E } from '@endo/far';
import {
  installContract,
  startContract,
} from './platform-goals/start-contract.js';
import { makeTracer } from './tools/debug.js';
// TODO want to do this eventually
// import { makeChainHub } from '@agoric/orchestration/src/utils/chainHub.js';
// import { makeChainHub } from '../exos/chain-hub.js';

const trace = makeTracer('OrCE');
const { entries, fromEntries } = Object;

trace('start proposal module evaluating');

const { Fail } = assert;

const BOARD_AUX = 'boardAux';
const contractName = 'orca';

// const marshalData = makeMarshal(_val => Fail`data only`);

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
 * @param config
 */
export const startOrcaContract = async (permittedPowers, config) => {
  trace('startOrcaContract()...');

  const {
    consume: {
      agoricNames: agoricNamesP,
      board,
      chainTimerService,
      orchestration: orchestrationP,
      localchain,
      chainStorage,
    },
    instance: {
      produce: { orca: produceInstance },
    },
  } = permittedPowers;

  trace('config', config);

  const {
    // must be supplied by caller or template-replaced
    bundleID = Fail`no bundleID`,
  } = config?.options?.[contractName] ?? {};

  // agoricNames gets updated each time; the promise space only once XXXXXXX
  // const installation = await orcaInstallationP;

  const installation = await installContract(permittedPowers, {
    name: contractName,
    bundleID,
  });

  const logp = label => async p => {
    trace(label, '...');
    const r = await p;
    trace(label, r);
    return r;
  };

  const orchestration = await logp('orchestration')(orchestrationP);
  const agoricNames = await agoricNamesP;
  const mainNode = await E(chainStorage).makeChildNode('orca');
  const storageNode = await E(mainNode).makeChildNode('state');
  const marshaller = await E(board).getPublishingMarshaller();

  const privateArgs = {
    storageNode,
    marshaller,
    orchestration: await orchestration,
    timer: await chainTimerService,
    localchain: await logp('localchain')(localchain),
    agoricNames: await agoricNames,
  };

  const started = await startContract(
    permittedPowers,
    { name: contractName, startArgs: { installation } },
    privateArgs,
  );

  trace(contractName, '(re)started WITH RESET');
  produceInstance.reset();
  produceInstance.resolve(started.instance);
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
    issuer: { consume: { IST: true }, produce: {} },
    brand: { consume: { IST: true }, produce: {} },
    instance: { produce: { orca: true } },
  },
};
harden(orcaManifest);

export const getManifestForOrca = ({ restoreRef }, { installKeys }) => {
  trace('getting manifest for orca');
  trace('installKeys');
  trace(installKeys);
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
  issuer: { consume: { IST: true }, produce: {} },
  brand: { consume: { IST: true }, produce: {} },
  instance: { produce: { orca: true } },
});

export const main = startOrcaContract;
