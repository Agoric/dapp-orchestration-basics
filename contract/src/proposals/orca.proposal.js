import { E } from '@endo/far';
import { makeTracer } from '@agoric/internal';


const trace = makeTracer('OrCE');
trace('start proposal module evaluating');


const contractName = 'orca';

/**
 * @param {BootstrapPowers & {installation: {consume: {orca: Installation<import('./orca.contract.js').start>}}}} permittedPowers
 * @param config
 */
export const startOrcaContract = async (permittedPowers, config) => {
  trace('startOrcaContract()... 0.0.93');
  console.log(permittedPowers)

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
      consume: {
        orca: orcaInstallation,
      }
    },
    instance: {
      // @ts-expect-error not a WellKnownName
      produce: { orca: produceInstance },
    },
  } = permittedPowers;

  trace('config', config);
  trace('permittedPowers', permittedPowers)

  const installation = await orcaInstallation;

  console.log("permittedPowers")
  console.log(permittedPowers)
  console.log("from inside startOrcaContract:", installation)

  console.log(cosmosInterchainService)
  console.log(agoricNames) // make storage node
  console.log("chainStorage")
  console.log(chainStorage)
  const storageNode = await E(chainStorage).makeChildNode('orca');

  console.log(storageNode)
  console.log("DONE MAKING NODES v0.3")
  const marshaller = await E(board).getPublishingMarshaller();
  console.log(marshaller)

  /** @type {StartUpgradableOpts<OrcaSF>} */
  const startOpts = {
    label: 'orca',
    installation,
    terms: undefined,
    privateArgs: {
      storageNode, 
      marshaller,
      orchestrationService: await cosmosInterchainService,
      timerService: await chainTimerService,
      localchain: await localchain,
      agoricNames: await agoricNames,
    }
  };

  trace("startOpts", startOpts)
  const { instance } = await E(startUpgradable)(startOpts);

  trace(contractName, '(re)started WITH RESET');
  produceInstance.reset();
  produceInstance.resolve(instance);
};

/** @type { import("@agoric/vats/src/core/lib-boot").BootstrapManifest } */
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
  return harden({
    manifest: orcaManifest,
    installations: {
      [contractName]: restoreRef(installKeys[contractName]),
    },
  });
};
