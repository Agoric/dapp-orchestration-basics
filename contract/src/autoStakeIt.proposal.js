// autoStakeIt.proposal.js
import { E } from '@endo/far';
import { makeTracer } from './debug.js';

/// <reference types="@agoric/vats/src/core/types-ambient"/>
/// <reference types="@agoric/zoe/src/contractFacet/types-ambient"/>

/**
 * @import {ERef} from '@endo/far';
 * @import {BootstrapManifest} from '@agoric/vats/src/core/lib-boot.js';
 * @import {ChainInfo, IBCConnectionInfo} from '@agoric/orchestration';
 * @import {AutoStakeItSF} from './autoStakeIt.contract.js';
 * @import {ContractStartFunction} from '@agoric/zoe/src/zoeService/utils.js';
 */

const trace = makeTracer('ASI');
const { entries, fromEntries } = Object;

trace('start proposal module evaluating');

const contractName = 'autoStakeIt';

/** @type {IBCConnectionInfo} */
const c1 = harden({
  id: 'connection-0',
  client_id: 'client-0',
  state: 3,
  counterparty: harden({
    client_id: 'client-0',
    connection_id: 'connection-0',
    prefix: {
      key_prefix: 'key-prefix-0',
    },
  }),
  transferChannel: harden({
    portId: 'transfer',
    channelId: 'channel-0',
    counterPartyPortId: 'transfer',
    counterPartyChannelId: 'channel-1',
    ordering: 2,
    version: '1',
    state: 3,
  }),
});

/** @type {Record<string, ChainInfo>} */
export const chainDetails = harden({
  agoric: {
    chainId: 'agoriclocal',
    stakingTokens: [{ denom: 'ubld' }],
    connections: { osmosislocal: c1 },
  },
  osmosis: {
    chainId: 'osmosislocal',
    stakingTokens: [{ denom: 'uosmo' }],
  },
});

/**
 * @type { <T extends Record<string, ERef<any>>>(obj: T) => Promise<{ [K in keyof T]: Awaited<T[K]>}> }
 */
export const allValues = async obj => {
  const es = await Promise.all(
    entries(obj).map(([k, vp]) => E.when(vp, v => [k, v])),
  );
  return fromEntries(es);
};

/**
 * @param {BootstrapPowers & {installation: {consume: {autoStakeIt: Installation<AutoStakeItSF>}}}} permittedPowers
 * @param {{options: {[contractName]: {
 *   bundleID: string;
 *   chainDetails: Record<string, ChainInfo>,
 * }}}} config
 */
export const startAutoStakeItContract = async (permittedPowers, config) => {
  trace('startAutoStakeItContract()...', config);

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
      consume: { autoStakeIt: autoStakeItInstallation },
    },
    instance: {
      // @ts-expect-error not a WellKnownName
      produce: { autoStakeIt: produceInstance },
    },
  } = permittedPowers;

  const installation = await autoStakeItInstallation;

  const storageNode = await E(chainStorage).makeChildNode('autoStakeIt');
  const marshaller = await E(board).getPublishingMarshaller();

  const { chainDetails: nameToInfo = chainDetails } =
    config.options[contractName];

  /** @type {StartUpgradableOpts<ContractStartFunction & AutoStakeItSF>} **/
  const startOpts = {
    label: 'autoStakeIt',
    installation,
    terms: { chainDetails: nameToInfo },
    privateArgs: {
      localchain: await localchain,
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
const autoStakeItManifest = {
  [startAutoStakeItContract.name]: {
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
      produce: { autoStakeIt: true },
      consume: { autoStakeIt: true },
    },
    instance: {
      produce: { autoStakeIt: true },
    },
  },
};
harden(autoStakeItManifest);

export const getManifestForAutoStakeIt = (
  { restoreRef },
  { installKeys, chainDetails },
) => {
  trace('getManifestForAutoStakeIt', installKeys);
  return harden({
    manifest: autoStakeItManifest,
    installations: {
      [contractName]: restoreRef(installKeys[contractName]),
    },
    options: {
      [contractName]: { chainDetails },
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
    consume: { autoStakeIt: true },
    produce: { autoStakeIt: true },
  },
  instance: { produce: { autoStakeIt: true } },
  brand: { consume: { BLD: true, IST: true }, produce: {} },
  issuer: { consume: { BLD: true, IST: true }, produce: {} },
});

export const main = startAutoStakeItContract;
