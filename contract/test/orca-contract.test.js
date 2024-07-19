// @ts-check

/* eslint-disable import/order -- https://github.com/endojs/endo/issues/1235 */
import { test as anyTest } from './prepare-test-env-ava.js';

import { createRequire } from 'module';
import { E, Far } from '@endo/far';
// import { makeCopyBag } from '@endo/patterns';
import { makeNodeBundleCache } from '@endo/bundle-source/cache.js';
import { makeZoeKitForTest } from '@agoric/zoe/tools/setup-zoe.js';

import { startOrcaContract } from '../src/orca.proposal.js';

import { makeMockTools } from './boot-tools.js';
import { getBundleId } from '../tools/bundle-tools.js';
import { startOrchCoreEval } from '../tools/startOrch.js';

// import { AmountMath, AssetKind, makeIssuerKit } from '@agoric/ertp';
// import { prepareOrchestrationTools } from '@agoric/orchestration'

// import { reincarnate } from '@agoric/swingset-liveslots/tools/setup-vat-data.js';

// /** @type {ReturnType<typeof reincarnate>} */
// let incarnation;

// export const getBaggage = () => {
//   return incarnation.fakeVomKit.cm.provideBaggage();
// };

/** @typedef {typeof import('../src/orca.contract.js').start} OrcaContractFn */

// const myRequire = createRequire(import.meta.url);
// const contractPath = myRequire.resolve(`../src/orca.contract.js`);
// const scriptRoot = {
//   orca: myRequire.resolve('../src/orca.proposal.js'),
// };

// /** @type {import('ava').TestFn<Awaited<ReturnType<makeTestContext>>>} */
// // @ts-expect-error - XXX what's going on here??
// const test = anyTest;

// /**
//  * Tests assume access to the zoe service and that contracts are bundled.
//  *
//  * See test-bundle-source.js for basic use of bundleSource().
//  * Here we use a bundle cache to optimize running tests multiple times.
//  *
//  * @param {import('ava').ExecutionContext} t
//  */
// const makeTestContext = async t => {
//   const { zoeService: zoe, feeMintAccess } = makeZoeKitForTest();
//   const bundleCache = await makeNodeBundleCache('bundles/', {}, s => import(s));
//   const bundle = await bundleCache.load(contractPath, 'orca');

//   const tools = await makeMockTools(t, bundleCache);
//   return { zoe, bundle, bundleCache, feeMintAccess, ...tools };
// };

// test.before(async t => (t.context = await makeTestContext(t)));

// test('Install the contract', async t => {
//   const { zoe, bundle } = t.context;
//   const installation = await E(zoe).install(bundle);
//   t.log('installed:', installation);
//   t.is(typeof installation, 'object');
// });

// // TODO: replace DummyStorageNode with better test mock
// test('Start Orca contract', async t => {
//   const { zoe, bundle } = t.context;
//   const installation = E(zoe).install(bundle);

//   const privateArgs = harden({
//     orchestration: Far('DummyOrchestration'),
//     storageNode: Far('DummyStorageNode'),
//     marshaller: Far('DummyMarshaller'),
//     timer: Far('DummyTimer'),
//     localchain: Far('DummyLocalchain'),
//     agoricNames: Far('DummyAgoricNames')
//   });

//   const { instance } = await E(zoe).startInstance(
//     installation,
//     {},
//     {},
//     privateArgs,
//   );
//   t.log('started:', instance);
//   t.truthy(instance);
// });

// test('Start Orca contract using core-eval', async t => {
//   const { runCoreEval, installBundles, makeQueryTool } = t.context;

//   t.log('run core-eval to start (dummy) orchestration');
//   await runCoreEval({
//     name: 'start-orchestration',
//     behavior: startOrchCoreEval,
//     entryFile: 'not used',
//     config: {},
//   });

//   const bundles = await installBundles({ orca: contractPath });

//   t.log('run orca core-eval');
//   const bundleID = getBundleId(bundles.orca);
//   const name = 'orca';
//   const { status } = await runCoreEval({
//     name,
//     behavior: startOrcaContract,
//     entryFile: scriptRoot.orca,
//     config: { options: { orca: { bundleID } } },
//   });
//   t.is(status, 'PROPOSAL_STATUS_PASSED');

//   const qt = makeQueryTool();
//   const instance = await qt
//     .queryData('published.agoricNames.instance')
//     .then(es => Object.fromEntries(es));
//   t.log(instance[name]);
// });


// make wallet driver
//make offer with wallet driver
//agoric-sdk/packages/boot/test/bootstrapTests/vaults-integration.test.ts : 89
// agoric-sdk/packages/boot/tools/drivers.ts
