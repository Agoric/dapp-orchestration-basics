// @ts-check

/* eslint-disable import/order -- https://github.com/endojs/endo/issues/1235 */
import { test as anyTest } from './prepare-test-env-ava.js';

import { createRequire } from 'module';
import { E, Far } from '@endo/far';
// import { makeCopyBag } from '@endo/patterns';
import { makeNodeBundleCache } from '@endo/bundle-source/cache.js';
import { AmountMath, makeIssuerKit } from '@agoric/ertp';
import { registerChain } from '@agoric/orchestration/src/chain-info.js';

import { startOrcaContract } from '../src/orca.proposal.js';

import { makeMockTools, mockBootstrapPowers } from './boot-tools.js';
import { startOrchCoreEval } from '../tools/startOrch.js';
import { getBundleId } from '../tools/bundle-tools.js';

/** @typedef {typeof import('../src/orca.contract.js').start} OrcaContractFn */

const nodeRequire = createRequire(import.meta.url);
const contractPath = nodeRequire.resolve(`../src/orca.contract.js`);
const scriptRoot = {
  orca: nodeRequire.resolve('../src/orca.proposal.js'),
};

/** @type {import('ava').TestFn<Awaited<ReturnType<makeTestContext>>>} */
// @ts-expect-error - XXX what's going on here??
const test = anyTest;

/**
 * @import {ChainInfo, IBCConnectionInfo} from '@agoric/orchestration';
 * @import {NameAdmin} from '@agoric/vats';
 * @import {ERef} from '@endo/eventual-send';
 */

/** @type {IBCConnectionInfo} */
const arbConnectionInfo = harden({
  transferChannel: harden({
    version: '1',
    state: 3, // open
    portId: 'transfer',
    ordering: 0, // ordered
    counterPartyPortId: 'transfer',
    counterPartyChannelId: 'channel-1',
    channelId: 'channel-0',
  }),
  state: 3, // OPEN
  id: 'connection-0',
  counterparty: harden({
    client_id: 'client-0',
    connection_id: 'connection-0',
    prefix: {
      key_prefix: 'key-prefix-0',
    },
  }),
  client_id: 'client-0',
  connectionDetails: `XXX connection details`,
});
const testConfig = harden({
  /** @type {Record<string, ChainInfo>} */
  chainInfo: {
    agoric: {
      chainId: `agoriclocal`,
      stakingTokens: [{ denom: 'ubld' }],
      connections: {
        osmosislocal: arbConnectionInfo,
      },
    },

    osmosis: {
      chainId: `osmosislocal`,
      stakingTokens: [{ denom: 'uosmo' }],
      connections: {
        agoriclocal: arbConnectionInfo,
      },
    },
  },
});

/**
 *
 * @param {ERef<NameAdmin>} agoricNamesAdmin
 */
const publishChainInfo = async agoricNamesAdmin => {
  await null;
  for (const [name, info] of Object.entries(testConfig.chainInfo)) {
    await registerChain(agoricNamesAdmin, name, info);
  }
};

// return harden({
//   ...state,
//   makeAccount: Far('Account', {
//     getChainId: () => state.chainId,
//     getAccountAddress: () => `${state.name}AccountAddress`,
//     getBalance: () => `1000${state.denom}`,
//   }),
//   getChainInfo: Far('ChainInfo', {
//     getChainId: () => state.chainId,
//     getDenom: () => state.denom,
//     getExpectedAddressPrefix: () => state.expectedAddressPrefix,
//   }),
// });

/**
 * Tests assume access to the zoe service and that contracts are bundled.
 *
 * See test-bundle-source.js for basic use of bundleSource().
 * Here we use a bundle cache to optimize running tests multiple times.
 *
 * @param {import('ava').ExecutionContext} t
 */
const makeTestContext = async t => {
  const bundleCache = await makeNodeBundleCache('bundles/', {}, s => import(s));
  const bundle = await bundleCache.load(contractPath, 'orca');

  const { powers } = await mockBootstrapPowers(t.log);
  // await publishChainInfo(powers.consume.agoricNamesAdmin);
  const tools = await makeMockTools(t, bundleCache);

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
                      encoding: 'bech32', // or 'ethereum', based on your requirements
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

  return {
    bundle,
    bundleCache,
    powers,
    cosmosInterchainService,
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
  const { powers, bundle } = t.context;
  const { zoe } = powers.consume;
  const installation = await E(zoe).install(bundle);
  t.log('installed:', installation);
  t.is(typeof installation, 'object');
});

test('Start Orca contract', async t => {
  const { bundle, powers } = t.context;
  const { zoe } = powers.consume;

  const installation = E(zoe).install(bundle);

  const privateArgs = harden({
    localchain: Far('DummyLocalChain'),
    storageNode: Far('DummyStorageNode'),
    orchestrationService: Far('DummyOrchestration'),
    timerService: Far('DummyTimer'),
    agoricNames: Far('DummyAgoricNames'),
    marshaller: Far('DummyMarshaller'),
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

  t.log('BLD stakers start orchestration');
  await runCoreEval({
    name: 'start-orchestration',
    behavior: startOrchCoreEval,
    entryFile: 'not used',
    config: {},
  });

  const name = 'orca';
  t.log('developer installs bundles');
  const bundles = await installBundles({ [name]: contractPath });

  t.log('run core-eval for', name);
  const bundleID = getBundleId(bundles[name]);
  const { status } = await runCoreEval({
    name,
    behavior: startOrcaContract,
    entryFile: scriptRoot[name],
    config: { options: { [name]: { bundleID } } },
  });
  console.log(status);
  t.is(status, 'PROPOSAL_STATUS_PASSED');

  const qt = makeQueryTool();
  const instance = await qt
    .queryData('published.agoricNames.instance')
    .then(es => Object.fromEntries(es));
  t.log(instance[name]);
});

const chainConfigs = {
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

    const { bundle, cosmosInterchainService, powers } = t.context;
    const { agoricNames, board, chainStorage, zoe } = powers.consume;
    t.log('installing the contract...');
    const installation = E(zoe).install(bundle);

    const privateArgs = harden({
      cosmosInterchainService,
      orchestrationService: cosmosInterchainService,
      storageNode: chainStorage,
      marshaller: E(board).getPublishingMarshaller(),
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
      { id: offerId },
    );
    t.log('initial user seat:', initialUserSeat);

    t.log('getting offer result...');
    const offerResult = await E(initialUserSeat).getOfferResult();
    t.log('offer result:', offerResult);
    t.truthy(offerResult, 'Offer result should exist');

    const { makeQueryTool } = t.context;
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
      { previousOffer: offerId },
    );
    const continuingOfferResult = await E(continuingUserSeat).getOfferResult();

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

    const { bundle, cosmosInterchainService, powers } = t.context;
    const { agoricNames, board, chainStorage, zoe } = powers.consume;
    t.log('installing the contract...');
    const installation = E(zoe).install(bundle);

    const privateArgs = harden({
      cosmosInterchainService,
      orchestrationService: cosmosInterchainService,
      storageNode: chainStorage,
      marshaller: E(board).getPublishingMarshaller(),
      timer: Far('DummyTimer'),
      timerService: Far('DummyTimer'),
      localchain: Far('DummyLocalchain'),
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
        id: offerId,
      },
    );
    t.log('initial user seat:', initialUserSeat);

    t.log('getting offer result...');
    const offerResult = await E(initialUserSeat).getOfferResult();
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
