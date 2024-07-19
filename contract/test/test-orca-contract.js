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

const myRequire = createRequire(import.meta.url);
const contractPath = myRequire.resolve(`../src/orca.contract.js`);
const scriptRoot = {
  orca: myRequire.resolve('../src/orca.proposal.js'),
};

/** @type {import('ava').TestFn<Awaited<ReturnType<makeTestContext>>>} */
// @ts-expect-error - XXX what's going on here??
const test = anyTest;

/**
 * Tests assume access to the zoe service and that contracts are bundled.
 *
 * See test-bundle-source.js for basic use of bundleSource().
 * Here we use a bundle cache to optimize running tests multiple times.
 *
 * @param {import('ava').ExecutionContext} t
 */
const makeTestContext = async t => {
  const { zoeService: zoe, feeMintAccess } = makeZoeKitForTest();
  const bundleCache = await makeNodeBundleCache('bundles/', {}, s => import(s));
  const bundle = await bundleCache.load(contractPath, 'orca');

  const tools = await makeMockTools(t, bundleCache);
  return { zoe, bundle, bundleCache, feeMintAccess, ...tools };
};

test.before(async t => (t.context = await makeTestContext(t)));

test('Install the contract', async t => {
  const { zoe, bundle } = t.context;
  const installation = await E(zoe).install(bundle);
  t.log('installed:', installation);
  t.is(typeof installation, 'object');
});

test('Start Orca contract', async t => {
  const { zoe, bundle } = t.context;
  const installation = E(zoe).install(bundle);

  const privateArgs = harden({
    // orchestration: Far('DummyOrchestration'),
    cosmosInterchainService: Far('DummyOrchestration'),
    storageNode: Far('DummyStorageNode'),
    marshaller: Far('DummyMarshaller'),
    timer: Far('DummyTimer'),
    localchain: Far('Dumm'),
    agoricNames: Far('agoricNames')
  });

  const { instance } = await E(zoe).startInstance(
    installation,
    {},
    {},
    privateArgs,
  );
  t.log('started:', instance);
  t.truthy(instance);
});

test('Start Orca contract using core-eval', async t => {
  const { runCoreEval, installBundles, makeQueryTool } = t.context;

  t.log('run core-eval to start (dummy) orchestration');
  
  t.log("before core eval")
  await runCoreEval({
    name: 'start-orchestration',
    behavior: startOrchCoreEval,
    entryFile: 'not used',
    config: {},
  });

  t.log("before install")
  const bundles = await installBundles({ orca: contractPath });

  t.log('run orca core-eval');
  t.log(`${bundles.orca}`)
  const bundleID = getBundleId(bundles.orca);
  t.log("bundleID")
  t.log(bundleID)
  const name = 'orca';
  const { status } = await runCoreEval({
    name,
    behavior: startOrcaContract,
    entryFile: scriptRoot.orca,
    config: { options: { orca: { bundleID } } },
  });
  console.log(status)
  t.is(status, 'PROPOSAL_STATUS_PASSED');

  const qt = makeQueryTool();
  const instance = await qt
    .queryData('published.agoricNames.instance')
    .then(es => Object.fromEntries(es));
  t.log(instance[name]);
});

export const chainConfigs = {
  cosmoshub: {
    chainId: 'gaialocal',
    denom: 'uatom',
    expectedAddressPrefix: 'cosmos',
  },
  osmosis: {
    chainId: 'osmosislocal',
    denom: 'uosmo',
    expectedAddressPrefix: 'osmo',
  },
  agoric: {
    chainId: 'agoriclocal',
    denom: 'ubld',
    expectedAddressPrefix: 'agoric',
  },
};

const orchestrationAccountScenario = test.macro({
  title: (_, chainName) =>
    `orchestrate - ${chainName} makeAccount returns a ContinuingOfferResult`,
  exec: async (t, chainName) => {
    const config = chainConfigs[chainName];
    if (!config) {
      return t.fail(`Unknown chain: ${chainName}`);
    }

    const { zoe, bundle } = t.context;
    // const { zoe, bundle } = t.context;
    const installation = E(zoe).install(bundle);

    const privateArgs = harden({
      // orchestration: Far('DummyOrchestration'),
      cosmosInterchainService: Far('DummyOrchestration'),
      storageNode: Far('DummyStorageNode'),
      marshaller: Far('DummyMarshaller'),
      timer: Far('DummyTimer'),
      localchain: Far('Dumm'),
      agoricNames: Far('agoricNames')
    });

    const { instance } = await E(zoe).startInstance(
      installation,
      {},
      {},
      privateArgs,
    );
    t.log('started:', instance);
    t.truthy(instance);
    t.log("before get public facet")
    const publicFacet = await E(zoe).getPublicFacet(instance);
    t.log("after get public facet")
    t.log(publicFacet)

    // make the initial offer
    const initialInvitation = await E(publicFacet).makeAccountInvitation();
    t.log("invitation")
    t.log(initialInvitation)
    const initialUserSeat = await E(zoe).offer(initialInvitation, {}, undefined, undefined);
    t.log("initialUserSeat")
    t.log(initialUserSeat)
    const initialOfferResult = await E(initialUserSeat).getOfferResult();
    t.log("initialOfferResult")
    t.log(initialOfferResult)
    const initialOfferId = await E(initialUserSeat).getOfferId();
    t.log("initialOfferId")
    t.log(initialOfferId)

    t.log('Initial Offer Result:', initialOfferResult);
    t.log('Initial Offer ID:', initialOfferId);

    // ensure the initial offer was accepted
    t.truthy(initialOfferId, 'Initial offer ID should be defined');

    // make the continuing offer
    // const continuingInvitation = E(publicFacet).makeAccountInvitation();
    // const continuingUserSeat = E(zoe).offer(
    //   continuingInvitation,
    //   { source: 'continuing', previousOffer: initialOfferId },
    //   undefined,
    //   { chainName }
    // );
    // const continuingOfferResult = await E(continuingUserSeat).getOfferResult();

    // t.log('Continuing Offer Result:', continuingOfferResult);

    // t.truthy(continuingOfferResult, 'continuing offer result should be defined');
  },
});

test(orchestrationAccountScenario, 'agoric');
test(orchestrationAccountScenario, 'osmosis');