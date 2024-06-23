import { makeTracer } from '@agoric/internal';
import { makeStorageNodeChild } from '@agoric/internal/src/lib-chainStorage.js';
import { Stake } from '@agoric/internal/src/tokens.js';
import { E } from '@endo/far';
// import { registerChainNamespace } from '../chain-info.js';

const trace = makeTracer('StartOrca', true);

/**
 * @param {BootstrapPowers & {
 *   installation: {
 *     consume: {
 *       orca: Installation<
 *         import('../src/orca.contract.js').start
 *       >;
 *     };
 *   };
 * }} powers
 */
export const startOrca = async ({
  consume: {
    agoricNames: agoricNamesP,
    agoricNamesAdmin,
    board,
    chainStorage,
    chainTimerService: chainTimerServiceP,
    localchain,
    startUpgradable,
  },
  installation: {
    consume: { orca },
  },
  instance: {
    produce: { orca: produceInstance },
  },
  issuer: {
    consume: { IST: istIssuerP },
    produce: { },
  },
}) => {
  const VSTORAGE_PATH = 'orca';
  trace('StartOrca');

  const storageNode = await makeStorageNodeChild(chainStorage, VSTORAGE_PATH);

  // NB: committee must only publish what it intended to be public
  const marshaller = await E(board).getPublishingMarshaller();

  const [agoricNames, timerService, timerBrand] = await Promise.all([
    agoricNamesP,
    chainTimerServiceP,
    chainTimerServiceP.then(ts => E(ts).getTimerBrand()),
  ]);

  /**
   * @type {StartUpgradableOpts<
   *   import('../../src/examples/stakeBld.contract.js').start
   * >}
   */
  const startOpts = {
    label: 'orca',
    installation: orca,
    // issuerKeywordRecord: harden({ In: await stakeIssuer }),
    issuerKeywordRecord: harden({}),
    terms: {},
    privateArgs: {
      // BEFOREPUSh populate agoricNames with 'agoric' info and test in a3p
      agoricNames,
      localchain: await localchain,
      timerService,
      timerBrand,
      storageNode,
      marshaller,
    },
  };

  const { instance } = await E(startUpgradable)(startOpts);
  produceInstance.resolve(instance);
};
harden(startStakeBld);