// @ts-check

/* eslint-disable import/order -- https://github.com/endojs/endo/issues/1235 */
import { test as anyTest } from './prepare-test-env-ava.js';

import { makeZoeKitForTest } from '@agoric/zoe/tools/setup-zoe.js';
import { makeNodeBundleCache } from '@endo/bundle-source/cache.js';
import { E } from '@endo/far';
import { createRequire } from 'module';
// import { prepareOrchestrationTools } from '@agoric/orchestration'

// import { reincarnate } from '@agoric/swingset-liveslots/tools/setup-vat-data.js';

// /** @type {ReturnType<typeof reincarnate>} */
// let incarnation;

// export const getBaggage = () => {
//   return incarnation.fakeVomKit.cm.provideBaggage();
// };

/** @typedef {typeof import('../src/orca.contract.js').start} AssetContractFn */

const myRequire = createRequire(import.meta.url);
const contractPath = myRequire.resolve(`../src/orca.contract.js`);

const test =
  /** @type {import('ava').TestFn<Awaited<ReturnType<makeTestContext>>>} */ (
    anyTest
  );

/**
 * Tests assume access to the zoe service and that contracts are bundled.
 *
 * See test-bundle-source.js for basic use of bundleSource().
 * Here we use a bundle cache to optimize running tests multiple times.
 *
 * @param {unknown} _t
 */
const makeTestContext = async _t => {
  const { zoeService: zoe, feeMintAccess } = makeZoeKitForTest();
  const bundleCache = await makeNodeBundleCache('bundles/', {}, s => import(s));
  const bundle = await bundleCache.load(contractPath, 'assetContract');
  return { zoe, bundle, bundleCache, feeMintAccess };
};

test.before(async t => (t.context = await makeTestContext(t)));

test('Install the contract', async t => {
  const { zoe, bundle } = t.context;
  const installation = await E(zoe).install(bundle);
  t.log(installation);
  t.is(typeof installation, 'object');
});

test.failing('Start Orca contract and test joining', async t => {
  t.fail();
  // const { zoe, bundle } = t.context;
  // const installation = E(zoe).install(bundle);
  // const terms = {};
  // let privateArgs = {
  //   orchestration: await orchestration,
  //   storageNode,
  //   marshaller,
  //   timer: await chainTimerService,
  // }
  // const zone = makeDurableZone(baggage);
  // const { makeOrchestrationKit } = prepareOrchestrationTools(
  //   zone.subZone('orchestration'),
  // );
  // const {
  //   buildProposal,
  //   evalProposal,
  //   runUtils: { EV },
  // } = t.context;
  // const { instance } = await E(zoe).startInstance(
  //   installation,
  //   {},
  //   terms,
  //   {
  //   }
  // );
});
