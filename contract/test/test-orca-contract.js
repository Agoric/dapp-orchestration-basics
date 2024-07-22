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
import { get } from 'http';

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
  
  const makeDummyStorageNode = (nodeName = 'rootNode') => {
    return Far('DummyStorageNode', {
      makeChildNode: async (childName) => {
        console.log(`makeChildNode called with name: ${childName}`);
        return makeDummyStorageNode(childName);
      },
      getPath: () => {
        console.log(`getPath called on node: ${nodeName}`);
        return `/${nodeName}`;
      },
      toCapData: () => {
        console.log(`toCapData called on node: ${nodeName}`);
        return {};
      },
      setValue: (value) => {
        console.log(`setValue called on node: ${nodeName} with value: ${value}`);
        return value;
      },
    });
  };


  const makeDummyMarshaller = () => {
    return Far('DummyMarshaller', {
      toCapData: (data) => {
        console.log('toCapData called with data:', data);
        return {};
      },
      fromCapData: (capData) => {
        console.log('fromCapData called with capData:', capData);
        return {};
      },
    });
  };

  const agoricNames = Far('DummyAgoricNames', {
    lookup: async (key, name) => {
      t.log("inside fake agoriname lookup")
      console.log("inside fake 2", key, name)
      if (key === 'chain' && (name === 'agoric' || name === 'osmosis')) {

        const state = harden({
          name: name,
          chainId: `${name}local`,
          denom: name === 'agoric' ? 'ubld' : 'uosmo',
          expectedAddressPrefix: name,
          details: `${name} chain details`,
          stakingTokens: [{ denom: name === 'agoric' ? 'ubld' : 'uosmo' }],
        });
    
        return harden({
          ...state,
          makeAccount: Far('Account', {
            getChainId: () => state.chainId,
            getAccountAddress: () => `${state.name}AccountAddress`,
            getBalance: () => `1000${state.denom}`,
          }),
          getChainInfo: Far('ChainInfo', {
            getChainId: () => state.chainId,
            getDenom: () => state.denom,
            getExpectedAddressPrefix: () => state.expectedAddressPrefix,
          }),
        });

      } else if (key === 'chainConnection' && (name === 'agoriclocal_osmosislocal' || name === 'osmosislocal_agoriclocal')) {
        return harden({
          connectionName: name,
          sourceChain: name.split('_')[0],
          destinationChain: name.split('_')[1],
          transferChannel: harden({
            version: '1',
            state: 'open',
            portId: 'transfer',
            ordering: 'ordered',
            counterPartyPortId: 'transfer',
            counterPartyChannelId: 'channel-1',
            channelId: 'channel-0'
          }),
          state: 'active',
          id: 'connection-0',
          counterparty: harden({
            client_id: 'client-0',
            connection_id: 'connection-0',
            prefix: {
              key_prefix: 'key-prefix-0'
            }
          }),
          client_id: 'client-0',
          connectionDetails: `${name} connection details`,
        });
      }
      throw Error(`Chain or connection not found: ${name}`);
    },
  });

  const cosmosInterchainService = Far('DummyCosmosInterchainService', {
    getChainHub: async () => {
      const chainHub = {
        registerChain: async (name, details) => {
          console.log(`chain registered: ${name}`, details);
        },
        getChain: async (name) => {
          if (name === 'agoric' || name === 'osmosis' || name === 'agoriclocal' || name === 'osmosislocal') {
  
            const state = harden({
              name: name,
              chainId: `${name}local`,
              denom: name === 'agoric' ? 'ubld' : 'uosmo',
              expectedAddressPrefix: name,
              details: `${name} chain details`,
              stakingTokens: [{ denom: name === 'agoric' ? 'ubld' : 'uosmo' }],
            });
        
            return harden({
              ...state,
              makeAccount: ()=>Far('Account', {
                getChainId: () => state.chainId,
                getAccountAddress: () => `${state.name}AccountAddress`,
                getAddress: () => harden({
                  chainId: state.chainId,
                  value: `${state.name}AccountAddress`,
                  encoding: 'bech32' // or 'ethereum', based on your requirements
                }),
                getBalance: () => `1000${state.denom}`,
              }),
              getChainInfo: ()=>Far('ChainInfo', {
                getChainId: () => state.chainId,
                getDenom: () => state.denom,
                getExpectedAddressPrefix: () => state.expectedAddressPrefix,
              }),
            });
    
          }
          throw Error(`chain not found: ${name}`);
        },
      };
      return chainHub;
    },
    makeAccount: async (name) => {
      const chainHub = await E(cosmosInterchainService).getChainHub();
      const chain = await E(chainHub).getChain(name);
      return E(chain).makeAccount();
    },
    getChainInfo: async (name) => {
      const chainHub = await E(cosmosInterchainService).getChainHub();
      const chain = await E(chainHub).getChain(name);
      return E(chain).getChainInfo();
    },
  });

  const chainHub = await E(cosmosInterchainService).getChainHub();
  await setupChainsForTests(chainHub);
  
  return { 
    zoe, 
    bundle, 
    bundleCache, 
    feeMintAccess, 
    cosmosInterchainService, 
    agoricNames,     
    storageNode: makeDummyStorageNode(),
    marshaller: makeDummyMarshaller(),
    ...tools 
  };
};

test.before(async t => (t.context = await makeTestContext(t)));

test('Install the contract', async t => {
  const { zoe, bundle } = t.context;
  const installation = await E(zoe).install(bundle);
  t.log('installed:', installation);
  t.is(typeof installation, 'object');
});

test('Start Orca contract', async t => {
  const { zoe, bundle, cosmosInterchainService, agoricNames, storageNode, marshaller } = t.context;
  const installation = E(zoe).install(bundle);

  
  const privateArgs = harden({
    // orchestration: Far('DummyOrchestration'),
    // cosmosInterchainService: Far('DummyOrchestration'),
    cosmosInterchainService,
    // storageNode: Far('DummyStorageNode'),
    storageNode,
    // marshaller: Far('DummyMarshaller'),
    marshaller,
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
      bundle, cosmosInterchainService, agoricNames, storageNode, marshaller } = t.context;
    // const { zoe, bundle } = t.context;
    const installation = E(zoe).install(bundle);

    const privateArgs = harden({
      // orchestration: Far('DummyOrchestration'),
      // cosmosInterchainService: Far('DummyOrchestration'),
      cosmosInterchainService,
      // storageNode: Far('DummyStorageNode'),
      storageNode,
      // marshaller: Far('DummyMarshaller'),
      marshaller,
      timer: Far('DummyTimer'),
      localchain: Far('DummyLocalchain'),
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

    // Get the result of the initial offer
    const offerResult = await E(initialUserSeat).getOfferResult();
    t.log("offerResult", offerResult);

  },
});

// test(orchestrationAccountScenario, 'agoric');
test(orchestrationAccountScenario, 'osmosis');