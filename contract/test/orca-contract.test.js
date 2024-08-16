// @ts-check

/* eslint-disable import/order -- https://github.com/endojs/endo/issues/1235 */
import { test as anyTest } from './prepare-test-env-ava.js';

import { createRequire } from 'module';
import { E, Far } from '@endo/far';
// import { makeCopyBag } from '@endo/patterns';
import { makeNodeBundleCache } from '@endo/bundle-source/cache.js';
import { makeZoeKitForTest } from '@agoric/zoe/tools/setup-zoe.js';
import { AmountMath, makeIssuerKit } from '@agoric/ertp';

import { startOrcaContract } from '../src/orca.proposal.js';

import { makeMockTools } from './boot-tools.js';
import { getBundleId } from '../tools/bundle-tools.js';
import { startOrchCoreEval } from '../tools/startOrch.js';
import { makeHeapZone } from '@agoric/zone';
import { prepareSwingsetVowTools } from '@agoric/vow/vat.js';

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

  const rootZone = makeHeapZone();
  const vowTools = prepareSwingsetVowTools(rootZone.subZone('vows'));

  const makeDummyStorageNode = (nodeName = 'rootNode') => {
    return Far('DummyStorageNode', {
      makeChildNode: async childName => {
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
      setValue: value => {
        console.log(
          `setValue called on node: ${nodeName} with value: ${value}`,
        );
        return value;
      },
    });
  };

  const makeDummyMarshaller = () => {
    return Far('DummyMarshaller', {
      toCapData: data => {
        console.log('toCapData called with data:', data);
        return {};
      },
      fromCapData: capData => {
        console.log('fromCapData called with capData:', capData);
        return {};
      },
    });
  };

  const agoricNames = Far('DummyAgoricNames', {
    lookup: async (key, name) => {
      t.log('inside fake agoriname lookup');
      console.log('inside fake 2', key, name);
      if (key === 'chain' && (name === 'agoric' || name === 'osmosis')) {
        const state = harden({
          name,
          chainId: `${name}local`,
          denom: name === 'agoric' ? 'ubld' : 'uosmo',
          expectedAddressPrefix: name === 'agoric' ? 'agoric' : 'osmo',
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
      } else if (
        key === 'chainConnection' &&
        (name === 'agoriclocal_osmosislocal' ||
          name === 'osmosislocal_agoriclocal')
      ) {
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
            channelId: 'channel-0',
          }),
          state: 'active',
          id: 'connection-0',
          counterparty: harden({
            client_id: 'client-0',
            connection_id: 'connection-0',
            prefix: {
              key_prefix: 'key-prefix-0',
            },
          }),
          client_id: 'client-0',
          connectionDetails: `${name} connection details`,
        });
      } else if (key === 'vbankAsset') {
        return harden({
          blockHeight: '1',
          values: () => [
            {
              body: [
                [
                  'ubld',
                  {
                    brand: '$0.Alleged: BLD brand',
                    denom: 'ubld',
                    displayInfo: {
                      assetKind: 'nat',
                      decimalPlaces: 6,
                    },
                    issuer: '$1.Alleged: BLD issuer',
                    issuerName: 'BLD',
                    proposedName: 'Agoric token',
                  },
                ],
              ],
            },
          ],
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
        getChain: async name => {
          if (
            name === 'agoric' ||
            name === 'osmosis' ||
            name === 'agoriclocal' ||
            name === 'osmosislocal'
          ) {
            const state = harden({
              name,
              chainId: `${name}local`,
              denom: name === 'agoric' ? 'ubld' : 'uosmo',
              expectedAddressPrefix: name === 'agoric' ? 'agoric' : 'osmo',
              details: `${name} chain details`,
              stakingTokens: [{ denom: name === 'agoric' ? 'ubld' : 'uosmo' }],
            });

            return harden({
              ...state,
              makeAccount: () =>
                Far('Account', {
                  getChainId: () => state.chainId,
                  getAccountAddress: () => `${state.name}AccountAddress`,
                  getAddress: () =>
                    harden({
                      chainId: state.chainId,
                      value: `${state.name}AccountAddress`,
                      encoding: 'bech32',
                    }),
                  getBalance: () => `1000${state.denom}`,
                }),
              getChainInfo: () =>
                Far('ChainInfo', {
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
    makeAccount: async name => {
      const chainHub = await E(cosmosInterchainService).getChainHub();
      const chain = await E(chainHub).getChain(name);
      return E(chain).makeAccount();
    },
    getChainInfo: async name => {
      const chainHub = await E(cosmosInterchainService).getChainHub();
      const chain = await E(chainHub).getChain(name);
      return E(chain).getChainInfo();
    },
  });

  const localchain = Far('DummyLocalchain', {
    getChainHub: async () => {
      const chainHub = {
        registerChain: async (name, details) => {
          console.log(`chain registered: ${name}`, details);
        },
        getChain: async () => {
          const state = harden({
            name: 'agoric',
            chainId: `agoriclocal`,
            denom: 'agoric',
            expectedAddressPrefix: 'agoric',
            details: `agoric chain details`,
            stakingTokens: [{ denom: 'agoric' }],
          });

          return harden({
            ...state,
            makeAccount: () =>
              Far('Account', {
                getChainId: () => state.chainId,
                getAccountAddress: () => `${state.name}AccountAddress`,
                getAddress: () => `${state.name}AccountAddress`,
                getBalance: () => `1000${state.denom}`,
                monitorTransfers: () => ``,
              }),
            getChainInfo: () =>
              Far('ChainInfo', {
                getChainId: () => state.chainId,
                getDenom: () => state.denom,
                getExpectedAddressPrefix: () => state.expectedAddressPrefix,
              }),
          });
        },
      };
      return chainHub;
    },
    makeAccount: async name => {
      const chainHub = await E(localchain).getChainHub();
      const chain = await E(chainHub).getChain(name);
      return E(chain).makeAccount();
    },
    getChainInfo: async name => {
      const chainHub = await E(localchain).getChainHub();
      const chain = await E(chainHub).getChain(name);
      return E(chain).getChainInfo();
    },
  });

  return {
    zoe,
    bundle,
    bundleCache,
    feeMintAccess,
    cosmosInterchainService,
    agoricNames,
    storageNode: makeDummyStorageNode(),
    marshaller: makeDummyMarshaller(),
    vowTools,
    localchain,
    ...tools,
  };
};

const makeQueryToolMock = () => {
  return {
    queryData: async path => {
      console.log(`Querying data at path: ${path}`);
      if (path.includes('wallet')) {
        return {
          offerToPublicSubscriberPaths: [['offerId', { account: 'osmo1abc' }]],
          status: {
            id: 'offerId',
            numWantsSatisfied: 1,
            result: 'UNPUBLISHED',
            error: undefined,
          },
        };
      }
      return {};
    },
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
  const {
    zoe,
    bundle,
    cosmosInterchainService,
    agoricNames,
    storageNode,
    marshaller,
  } = t.context;
  const installation = E(zoe).install(bundle);

  const privateArgs = harden({
    // orchestration: Far('DummyOrchestration'),
    // cosmosInterchainService: Far('DummyOrchestration'),
    cosmosInterchainService,
    orchestrationService: cosmosInterchainService,
    // storageNode: Far('DummyStorageNode'),
    storageNode,
    // marshaller: Far('DummyMarshaller'),
    marshaller,
    timer: Far('DummyTimer'),
    timerService: Far('DummyTimer'),
    localchain: Far('Dumm'),
    // agoricNames: Far('agoricNames')
    agoricNames,
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
  // const { runCoreEval, installBundles } = t.context;

  t.log('run core-eval to start (dummy) orchestration');

  t.log('before core eval');
  await runCoreEval({
    name: 'start-orchestration',
    behavior: startOrchCoreEval,
    entryFile: 'not used',
    config: {},
  });

  t.log('before install');
  const bundles = await installBundles({ orca: contractPath });

  t.log('run orca core-eval');
  t.log(`${bundles.orca}`);
  const bundleID = getBundleId(bundles.orca);
  t.log('bundleID');
  t.log(bundleID);
  const name = 'orca';
  const { status } = await runCoreEval({
    name,
    behavior: startOrcaContract,
    entryFile: scriptRoot.orca,
    config: { options: { orca: { bundleID } } },
  });
  console.log(status);
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

test('Verify chain registration', async t => {
  const { cosmosInterchainService } = t.context;
  const chainHub = await E(cosmosInterchainService).getChainHub();

  const agoricChain = await E(chainHub).getChain('agoric');
  t.truthy(agoricChain, 'Agoric chain should be registered');

  const osmosisChain = await E(chainHub).getChain('osmosis');
  t.truthy(osmosisChain, 'Osmosis chain should be registered');
});

const queryVstorage = async (t, qt, wallet, offerId) => {
  t.log(`querying vstorage for wallet: ${wallet}, offerId: ${offerId}`);
  const currentWalletRecord = await qt.queryData(
    `published.wallet.${wallet}.current`,
  );
  t.log('current wallet record:', currentWalletRecord);
  const offerToPublicSubscriberMap = Object.fromEntries(
    currentWalletRecord.offerToPublicSubscriberPaths,
  );
  t.log('offer to public subscriber map:', offerToPublicSubscriberMap);
  const address = offerToPublicSubscriberMap[offerId]?.account.split('.').pop();
  t.log('extracted address:', address);
  return { address, currentWalletRecord };
};

const logVstorageState = async (t, qt, path) => {
  const data = await qt.queryData(path);
  t.log(`vstorage data at ${path}:`, data);
};

const orchestrationAccountScenario = test.macro({
  title: (_, chainName) =>
    `orchestrate - ${chainName} makeAccount returns a ContinuingOfferResult`,
  exec: async (t, chainName) => {
    const config = chainConfigs[chainName];
    if (!config) {
      return t.fail(`unknown chain: ${chainName}`);
    }

    const {
      zoe,
      bundle,
      cosmosInterchainService,
      agoricNames,
      storageNode,
      marshaller,
      vowTools: vt,
    } = t.context;
    t.log('installing the contract...');
    const installation = E(zoe).install(bundle);

    const privateArgs = harden({
      cosmosInterchainService,
      orchestrationService: cosmosInterchainService,
      storageNode,
      marshaller,
      timer: Far('DummyTimer'),
      timerService: Far('DummyTimer'),
      localchain: Far('DummyLocalchain'),
      agoricNames,
    });

    t.log('starting the instance...');
    const { instance } = await E(zoe).startInstance(
      installation,
      {},
      {},
      privateArgs,
    );
    t.log('instance started:', instance);
    t.truthy(instance);

    t.log('getting public facet...');
    const publicFacet = await E(zoe).getPublicFacet(instance);
    t.log('public facet obtained:', publicFacet);

    t.log('creating account invitation...');
    const initialInvitation = await E(publicFacet).makeAccountInvitation();
    t.log('invitation created:', initialInvitation);

    const makeAccountOffer = {
      give: {},
      want: {},
      exit: { onDemand: null },
    };

    t.log('making offer...');
    const offerId = 'offerId';
    const initialUserSeat = await E(zoe).offer(
      initialInvitation,
      makeAccountOffer,
      undefined,
      { chainName: 'osmosis' },
    );
    t.log('initial user seat:', initialUserSeat);

    t.log('getting offer result...');
    const offerResult = await vt.when(E(initialUserSeat).getOfferResult());

    t.log('offer result:', offerResult);
    t.truthy(offerResult, 'Offer result should exist');

    const qt = makeQueryToolMock();
    const wallet = 'test-wallet';
    // log vstorage state before querying
    await logVstorageState(t, qt, 'published.agoricNames');

    const { address, currentWalletRecord } = await queryVstorage(
      t,
      qt,
      wallet,
      offerId,
    );

    t.log('got address:', address);
    t.regex(
      address,
      new RegExp(`^${config.expectedAddressPrefix}1`),
      `Address for ${chainName} is valid`,
    );
    t.log('current wallet record', currentWalletRecord);

    const continuingInvitation = await E(publicFacet).makeAccountInvitation();
    t.truthy(continuingInvitation, 'continuing invitation should be created');

    const continuingOffer = {
      give: {},
      want: {},
      exit: { onDemand: null },
    };

    const continuingUserSeat = await E(zoe).offer(
      continuingInvitation,
      continuingOffer,
      undefined,
      {
        chainName: 'osmosis',
        previousOffer: offerId,
      },
    );
    const continuingOfferResult = await vt.when(
      continuingUserSeat.getOfferResult(),
    );

    t.truthy(continuingOfferResult, 'continuing offer should produce a result');
    t.log('continuing offer result', continuingOfferResult);
  },
});

const orchestrationAccountAndFundScenario = test.macro({
  title: (_, chainName) =>
    `orchestrate - ${chainName} makeAccount and fund returns a ContinuingOfferResult`,
  exec: async (t, chainName) => {
    const config = chainConfigs[chainName];
    if (!config) {
      return t.fail(`unknown chain: ${chainName}`);
    }

    const {
      zoe,
      bundle,
      cosmosInterchainService,
      agoricNames,
      storageNode,
      marshaller,
      vowTools: vt,
      localchain,
    } = t.context;
    t.log('installing the contract...');
    const installation = E(zoe).install(bundle);

    const privateArgs = harden({
      cosmosInterchainService,
      orchestrationService: cosmosInterchainService,
      storageNode,
      marshaller,
      timer: Far('DummyTimer'),
      timerService: Far('DummyTimer'),
      localchain,
      agoricNames,
    });

    const { mint, issuer, brand } = makeIssuerKit('BLD');

    const issuers = {
      BLDIssuer: issuer,
    };

    t.log('starting the instance...');
    const { instance } = await E(zoe).startInstance(
      installation,
      issuers,
      {},
      privateArgs,
    );
    t.log('instance started:', instance);
    t.truthy(instance);

    t.log('getting public facet...');
    const publicFacet = await E(zoe).getPublicFacet(instance);
    t.log('public facet obtained:', publicFacet);

    t.log('creating account invitation...');
    const initialInvitation =
      await E(publicFacet).makeCreateAndFundInvitation();
    t.log('invitation created:', initialInvitation);

    t.log('brand', brand);
    const amount = AmountMath.make(brand, 1n);
    const makeAccountOffer = {
      give: { Deposit: amount },
      want: {},
      exit: { onDemand: null },
    };

    const bldPurse = issuer.makeEmptyPurse();
    const payment = mint.mintPayment(amount);
    bldPurse.deposit(payment);
    const withdrawnDeposit = await E(bldPurse).withdraw(amount);
    t.log('withdrawnDeposit', withdrawnDeposit);
    t.log('making offer...');
    const offerId = 'offerId';
    const initialUserSeat = await E(zoe).offer(
      initialInvitation,
      makeAccountOffer,
      {
        Deposit: withdrawnDeposit,
      },
      {
        chainName: 'osmosis',
      },
    );
    t.log('initial user seat:', initialUserSeat);

    t.log('getting offer result...');
    const offerResult = await vt.when(E(initialUserSeat).getOfferResult());

    t.log('offer result:', offerResult);
    t.truthy(offerResult, 'Offer result should exist');

    const qt = makeQueryToolMock();
    const wallet = 'test-wallet';
    await logVstorageState(t, qt, 'published.agoricNames');

    const { address, currentWalletRecord } = await queryVstorage(
      t,
      qt,
      wallet,
      offerId,
    );

    t.log('got address:', address);
    t.regex(
      address,
      new RegExp(`^${config.expectedAddressPrefix}1`),
      `Address for ${chainName} is valid`,
    );
    t.log('current wallet record', currentWalletRecord);
  },
});

test(orchestrationAccountScenario, 'osmosis');
test(orchestrationAccountAndFundScenario, 'osmosis');
