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
// import { makeChainHub } from '@agoric/orchestration/src/utils/chainHub.js';
// import {commonSetup} from '@agoric/orchestration/test/support.js'
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
  

  // mock agoricNames
  const agoricNames = Far('DummyAgoricNames', {
    lookup: async (key, name) => {
      if (key === 'chain' && (name === 'agoric' || name === 'osmosis')) {
        return {
          name,
          chainId: `${name}local`,
          denom: name === 'agoric' ? 'ubld' : 'uosmo',
          expectedAddressPrefix: name,
          details: `${name} chain details`
        };
      }
      throw Error(`Chain not found: ${name}`);
    },
  });

  // mock cosmosInterchainService
  const cosmosInterchainService = Far('DummyCosmosInterchainService', {
    getChainHub: async () => {
      const chainHub = {
        registerChain: async (name, details) => {
          console.log(`chain registered: ${name}`, details);
        },
        getChain: async (name) => {
          if (name === 'agoric' || name === 'osmosis') {
            return { name, details: `${name} chain details` };
          }
          throw Error(`chain not found: ${name}`);
        },
        lookup: async (name) => {
          t.log("INSIDE FAKE LOOKUP")
          if (name === 'agoric' || name === 'osmosis') {
            return { name, details: `${name} chain details` };
          }
          throw Error(`chain not found: ${name}`);
        },
      };
      return chainHub;
    },
  });

  // setup chain registration for tests
  const chainHub = await E(cosmosInterchainService).getChainHub();
  await setupChainsForTests(chainHub);
  
  return { zoe, bundle, bundleCache, feeMintAccess, cosmosInterchainService, agoricNames, ...tools };
};

test.before(async t => (t.context = await makeTestContext(t)));

test('Install the contract', async t => {
  const { zoe, bundle } = t.context;
  const installation = await E(zoe).install(bundle);
  t.log('installed:', installation);
  t.is(typeof installation, 'object');
});

test('Start Orca contract', async t => {
  const { zoe, bundle, cosmosInterchainService, agoricNames } = t.context;
  const installation = E(zoe).install(bundle);

  
  const privateArgs = harden({
    // orchestration: Far('DummyOrchestration'),
    // cosmosInterchainService: Far('DummyOrchestration'),
    cosmosInterchainService,
    storageNode: Far('DummyStorageNode'),
    marshaller: Far('DummyMarshaller'),
    timer: Far('DummyTimer'),
    localchain: Far('Dumm'),
    // agoricNames: Far('agoricNames')
    agoricNames
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


/////////////////////////


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

const agoricChainDetails = {
  chainId: 'agoriclocal',
  denom: 'ubld',
  expectedAddressPrefix: 'agoric',
};

const osmosisChainDetails = {
  chainId: 'osmosislocal',
  denom: 'uosmo',
  expectedAddressPrefix: 'osmo',
};

const setupChainsForTests = async (chainHub) => {
  await E(chainHub).registerChain('agoric', agoricChainDetails);
  await E(chainHub).registerChain('osmosis', osmosisChainDetails);
};


test('Verify chain registration', async t => {
  const { cosmosInterchainService } = t.context;
  const chainHub = await E(cosmosInterchainService).getChainHub();

  const agoricChain = await E(chainHub).getChain('agoric');
  t.truthy(agoricChain, 'Agoric chain should be registered');

  const osmosisChain = await E(chainHub).getChain('osmosis');
  t.truthy(osmosisChain, 'Osmosis chain should be registered');
});

const orchestrationAccountScenario = test.macro({
  title: (_, chainName) =>
    `orchestrate - ${chainName} makeAccount returns a ContinuingOfferResult`,
  exec: async (t, chainName) => {
    const config = chainConfigs[chainName];
    if (!config) {
      return t.fail(`Unknown chain: ${chainName}`);
    }

    const { 
      // bootstrap: { vowTools: vt },
      zoe, 
      bundle, cosmosInterchainService, agoricNames } = t.context;
    // const { zoe, bundle } = t.context;
    const installation = E(zoe).install(bundle);

    const privateArgs = harden({
      // orchestration: Far('DummyOrchestration'),
      // cosmosInterchainService: Far('DummyOrchestration'),
      cosmosInterchainService,
      storageNode: Far('DummyStorageNode'),
      marshaller: Far('DummyMarshaller'),
      timer: Far('DummyTimer'),
      localchain: Far('Dumm'),
      // agoricNames: Far('agoricNames')
      agoricNames
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

    const makeAccountOffer = {
      give: {
      },
      want: {
      },
      exit: { onDemand: null }, 
    };

    const initialUserSeat = await E(zoe).offer(initialInvitation, makeAccountOffer, undefined, undefined);
    t.log("initialUserSeat")
    t.log(initialUserSeat)

  },
});

// test(orchestrationAccountScenario, 'agoric');
test(orchestrationAccountScenario, 'osmosis');