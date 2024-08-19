/**
 * @file A proposal to start the basic flows contract.
 */
import { makeTracer } from '@agoric/internal';
import { makeStorageNodeChild } from '@agoric/internal/src/lib-chainStorage.js';
import { E } from '@endo/far';

/**
 * @import {BasicFlowsSF} from '@agoric/orchestration/src/examples/basic-flows.contract.js';
 */

const trace = makeTracer('StartBasicFlows', true);
const contractName = 'basicFlows';

/**
 * See `@agoric/builders/builders/scripts/orchestration/init-basic-flows.js` for
 * the accompanying proposal builder. Run `agoric run
 * packages/builders/scripts/orchestration/init-basic-flows.js` to build the
 * contract and proposal files.
 *
 */
export const startBasicFlows = async ({
  consume: {
    agoricNames,
    board,
    chainStorage,
    chainTimerService,
    cosmosInterchainService,
    localchain,
    startUpgradable,
  },
  installation: {
    consume: { [contractName]: installation },
  },
  instance: {
    produce: { [contractName]: produceInstance },
  },
}) => {
  trace(`start ${contractName}`);
  await null;

  const storageNode = await makeStorageNodeChild(chainStorage, contractName);
  const marshaller = await E(board).getPublishingMarshaller();

  const startOpts = {
    label: 'basicFlows',
    installation,
    terms: undefined,
    privateArgs: {
      agoricNames: await agoricNames,
      orchestrationService: await cosmosInterchainService,
      localchain: await localchain,
      storageNode,
      marshaller,
      timerService: await chainTimerService,
    },
  };
  const { instance } = await E(startUpgradable)(startOpts);
  produceInstance.reset();
  produceInstance.resolve(instance);
  trace('Done.');
};
harden(startBasicFlows);

export const getManifestForContract = (
  { restoreRef },
  { installKeys, ...options },
) => {
  return {
    manifest: {
      [startBasicFlows.name]: {
        consume: {
          agoricNames: true,
          board: true,
          chainStorage: true,
          chainTimerService: true,
          cosmosInterchainService: true,
          localchain: true,
          startUpgradable: true,
        },
        installation: {
          consume: { [contractName]: true },
        },
        instance: {
          produce: { [contractName]: true },
        },
      },
    },
    installations: {
      [contractName]: restoreRef(installKeys[contractName]),
    },
    options,
  };
};
