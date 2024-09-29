// @ts-check

import { test as anyTest } from './prepare-test-env-ava.js';

import { createRequire } from 'module';
import { E, Far, passStyleOf } from '@endo/far';
import { makeNodeBundleCache } from '@endo/bundle-source/cache.js';
import { AmountMath } from '@agoric/ertp';
import { prepareVowTools } from '@agoric/vow/vat.js';

import { startOrcaContract, chainDetails } from '../src/orca.proposal.js';

import { makeMockTools, mockBootstrapPowers } from './boot-tools.js';
import { getBundleId } from '../tools/bundle-tools.js';
import { startOrchCoreEval } from '../tools/startOrch.js';
import { installContract } from '../src/platform-goals/start-contract.js';

/**
 * @import {IcaAccount, MakeCosmosInterchainService} from '@agoric/orchestration';
 * @import {LocalChain,LocalChainAccount} from '@agoric/vats/src/localchain.js';
 * @import {TargetRegistration} from '@agoric/vats/src/bridge-target.js';
 * @import {OrcaSF} from '../src/orca.contract.js';
 */

const nodeRequire = createRequire(import.meta.url);

const contractPath = nodeRequire.resolve(`../src/orca.contract.js`);
const scriptRoot = {
  orca: nodeRequire.resolve('../src/orca.proposal.js'),
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
  const { powers } = await mockBootstrapPowers(t.log);

  const bundleCache = await makeNodeBundleCache('bundles/', {}, s => import(s));
  const bundle = await bundleCache.load(contractPath, 'orca');
  const tools = await makeMockTools(t, bundleCache);

  const zones = {
    cosmos: powers.zone.subZone('cosmosInterchainService'),
  };

  const cVowTools = prepareVowTools(zones.cosmos);

  /** @type {ReturnType<MakeCosmosInterchainService>} */
  const cosmosInterchainService = Far('CosmosInterchainService mock', {
    makeAccount: (chainId, _host, _controller, _opts) => {
      const denom = chainId.startsWith('agoric') ? 'ubld' : 'uosmo';

      /** @type {IcaAccount} */
      const account = Far('Account', {
        getChainId: () => chainId,
        getAccountAddress: () => `${chainId}AccountAddress`,
        getAddress: () =>
          harden({
            chainId,
            value: `${chainId}AccountAddress`,
            encoding: 'bech32',
          }),
        getBalance: () => `1000${denom}`,
        deactivate: () => assert.fail(`mock 1`),
        executeEncodedTx: () => assert.fail(`mock 2`),
        executeTx: () => assert.fail(`mock 3`),
        getLocalAddress: () => '/ibc-port/xyz',
        getPort: () => assert.fail(`mock 4`),
        getRemoteAddress: () => '/x/ibc-port/y/ordered/z',
        reactivate: () => assert.fail(`mock 6`),
      });

      return cVowTools.asVow(() => account);
    },
    provideICQConnection(_controllerConnectionId, _version) {
      throw Error('mock');
    },
  });

  const BLD = await powers.consume.bldIssuerKit;
  /** @type {LocalChain} */
  const localchain = Far('Localchain mock', {
    async makeAccount() {
      /** @type {LocalChainAccount} */
      const acct = Far('LocalChainAccount mock', {
        getAddress() {
          return 'agoric123';
        },
        getBalance() {
          throw Error('mock TODO getBalance');
        },
        async deposit(payment, optAmountShape) {
          return AmountMath.make(BLD.brand, 1234n);
        },
        withdraw() {
          throw Error('mock TODO withdraw');
        },
        executeTx(msgs) {
          throw Error('TODO: use IBC mocks or something'); // TODO: Issue #53
        },
        async monitorTransfers(_tap) {
          /** @type {TargetRegistration} */
          const reg = Far('TR mock', {
            revoke() {
              throw Error('TODO revoke');
            },
            updateTargetApp() {
              throw Error('TODO updateTargetApp');
            },
          });
          return reg;
        },
      });
      return acct;
    },
    query() {
      throw Error('mock TODO query');
    },
    queryMany() {
      throw Error('mock TODO queryMany');
    },
  });

  const vowTools = prepareVowTools(powers.zone);

  return {
    bundle,
    bundleCache,
    cosmosInterchainService,
    localchain,
    vowTools,
    bootstrapSpace: powers.consume,
    ...tools,
  };
};

test.before(async t => (t.context = await makeTestContext(t)));

test('Install the contract', async t => {
  const { bootstrapSpace, bundle } = t.context;
  const { zoe } = bootstrapSpace;
  const installation = await E(zoe).install(bundle);
  t.log('installed:', installation);
  t.is(typeof installation, 'object');
});

test('Start Orca contract', async t => {
  const { bundle, bootstrapSpace, cosmosInterchainService, localchain } =
    t.context;
  const { zoe } = bootstrapSpace;
  /** @type {Installation<OrcaSF>} */
  const installation = await E(zoe).install(bundle);

  const privateArgs = harden({
    orchestrationService: cosmosInterchainService,
    storageNode: await bootstrapSpace.chainStorage,
    marshaller: await E(bootstrapSpace.board).getPublishingMarshaller(),
    timerService: await bootstrapSpace.chainTimerService,
    localchain,
    agoricNames: await bootstrapSpace.agoricNames,
  });

  const { instance } = await E(zoe).startInstance(
    installation,
    {},
    // @ts-expect-error XXX startInstance typedef problem?
    { chainDetails },
    privateArgs,
  );
  t.log('started:', instance);
  t.truthy(instance);
});

test('Start Orca contract using core-eval', async t => {
  const { runCoreEval, installBundles, makeQueryTool } = t.context;
  // const { runCoreEval, installBundles } = t.context;

  t.log('run core-eval to start (dummy) orchestration 2');
  await runCoreEval({
    name: 'start-orchestration',
    behavior: startOrchCoreEval,
    entryFile: 'not used',
    config: {},
  });

  t.log('before install');
  const bundles = await installBundles({ orca: contractPath });

  t.log('run orca core-eval');
  const bundleID = getBundleId(bundles.orca);
  t.log('bundleID', bundleID);

  const name = 'orca';

  // the script produced by agoric run wraps startOrcaContract
  // in such a way that the contract gets installed automatically
  const startOrcaWrapped = async (permittedPowers, config) => {
    await installContract(permittedPowers, {
      name,
      bundleID,
    });
    await startOrcaContract(permittedPowers, config);
  };
  try {
    const result = await runCoreEval({
      name,
      behavior: startOrcaWrapped,
      entryFile: scriptRoot.orca,
      config: {
        options: { orca: { chainDetails } },
      },
    });

    t.log('runCoreEval finished with status:', result);
    t.is(result.status, 'PROPOSAL_STATUS_PASSED');
  } catch (error) {
    t.log('Error during runCoreEval:', error);
    throw error;
  }

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
    const {
      bundle,
      cosmosInterchainService,
      localchain,
      bootstrapSpace,
      vowTools: vt,
    } = t.context;
    const { zoe } = bootstrapSpace;

    t.log('installing the contract...'); // why are we doing this again???
    /** @type {Installation<OrcaSF>} */
    const installation = await E(zoe).install(bundle);

    const privateArgs = harden({
      orchestrationService: cosmosInterchainService,
      storageNode: await bootstrapSpace.chainStorage,
      marshaller: await E(bootstrapSpace.board).getPublishingMarshaller(),
      timerService: await bootstrapSpace.chainTimerService,
      localchain,
      agoricNames: await bootstrapSpace.agoricNames,
    });

    t.log('starting the instance...');
    const { instance } = await E(zoe).startInstance(
      installation,
      {},
      // @ts-expect-error XXX startInstance typedef problem?
      { chainDetails },
      privateArgs,
    );
    const publicFacet = await E(zoe).getPublicFacet(instance);

    t.log('creating account invitation...');
    const toMakeAccount = await E(publicFacet).makeAccountInvitation();

    t.log('making offer...', chainName);
    const seat = await E(zoe).offer(toMakeAccount, {}, undefined, {
      chainName,
    });

    const offerResult = await vt.when(E(seat).getOfferResult());
    t.log('offer result:', offerResult);
    t.is(
      passStyleOf(offerResult.invitationMakers),
      'remotable',
      'Offer include invitationMakers',
    );
    t.like(offerResult, {
      publicSubscribers: {
        account: {
          description: 'Staking Account holder status',
          storagePath: 'mockChainStorageRoot.osmosislocalAccountAddress',
        },
      },
    });
  },
});

const orchestrationAccountAndFundScenario = test.macro({
  title: (_, chainName) =>
    `orchestrate - ${chainName} makeAccount and fund returns a ContinuingOfferResult`,
  exec: async (t, chainName) => {
    const {
      bundle,
      bootstrapSpace,
      cosmosInterchainService,
      localchain,
      vowTools: vt,
    } = t.context;
    const { zoe } = bootstrapSpace;
    t.log('installing the contract...');
    /** @type {Installation<OrcaSF>} */
    const installation = await E(zoe).install(bundle);

    const privateArgs = harden({
      orchestrationService: cosmosInterchainService,
      storageNode: await bootstrapSpace.chainStorage,
      marshaller: await E(bootstrapSpace.board).getPublishingMarshaller(),
      timerService: await bootstrapSpace.chainTimerService,
      localchain,
      agoricNames: await bootstrapSpace.agoricNames,
    });

    const BLD = await bootstrapSpace.bldIssuerKit;

    t.log('starting the instance...');
    const { instance } = await E(zoe).startInstance(
      installation,
      { BLD: BLD.issuer },
      // @ts-expect-error XXX startInstance typedef problem?
      { chainDetails },
      privateArgs,
    );
    const publicFacet = await E(zoe).getPublicFacet(instance);

    t.log('creating account invitation...');
    const toCreateAndFund = await E(publicFacet).makeCreateAndFundInvitation();

    const Deposit = AmountMath.make(BLD.brand, 1n);
    const payment = BLD.mint.mintPayment(Deposit);
    t.log('making offer...');
    const seat = await E(zoe).offer(
      toCreateAndFund,
      { give: { Deposit } },
      { Deposit: payment },
      { chainName, denom: 'ubld' },
    );

    let offerResult;
    await t.throwsAsync(
      async () => (offerResult = await vt.when(E(seat).getOfferResult())),
      { message: /TODO: use IBC mocks or something/ },
    );
    t.pass();
    return;
    // TODO:
    //   t.log('offer result:', offerResult);
    //   t.truthy(offerResult, 'Offer result should exist');

    //   t.is(
    //     passStyleOf(offerResult.invitationMakers),
    //     'remotable',
    //     'Offer include invitationMakers',
    //   );
    //   t.like(offerResult, {
    //     publicSubscribers: {
    //       account: {
    //         description: 'Staking Account holder status',
    //         storagePath: 'mockChainStorageRoot.osmosislocalAccountAddress',
    //       },
    //     },
    //   });
  },
});

test(orchestrationAccountScenario, 'osmosis');
test(orchestrationAccountAndFundScenario, 'osmosis');
