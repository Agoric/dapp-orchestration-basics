import { test as anyTest } from '@agoric/zoe/tools/prepare-test-env-ava.js';

import { AmountMath } from '@agoric/ertp';
import { makeNodeBundleCache } from '@endo/bundle-source/cache.js';
import childProcess from 'node:child_process';
import fsp from 'node:fs/promises';
import { createRequire } from 'node:module';
import { ConfigContext, useRegistry } from 'starshipjs';
import { makeDoOffer } from '../tools/e2e-tools.js';
import { chainConfig, commonSetup, ensureAccounts } from './support.js';
import { makeContainer } from '../tools/agd-lib.js';

const nodeRequire = createRequire(import.meta.url);
const configFile = nodeRequire.resolve('../../e2e-testing/config.yaml');

/**
 * @import {TestFn} from 'ava';
 */

/** @type {TestFn<Awaited<ReturnType<makeTestContext>>>} */
const test = anyTest;

const contractName = 'orca';
const contractBuilder = './src/builder/init-orca.js';

const makeTestContext = async t => {
  t.log('configure starship regisry', configFile);
  const fetcher = await useRegistry(configFile);
  await ConfigContext.init(configFile, fetcher);

  const bundleCache = await makeNodeBundleCache('bundles', {}, s => import(s));
  const container = makeContainer({ execFileSync: childProcess.execFileSync });

  const { deployBuilder, retryUntilCondition, ...tools } = commonSetup(t, {
    execFile: childProcess.execFile,
    container,
    bundleCache,
    readFile: fsp.readFile,
    fetch,
    setTimeout: globalThis.setTimeout,
    log: console.log,
  });
  const wallets = await ensureAccounts(tools.agd.keys);

  t.log('bundle and install contract', contractName);
  await deployBuilder(contractBuilder);
  const { vstorageClient } = tools;
  await retryUntilCondition(
    () => vstorageClient.queryData(`published.agoricNames.instance`),
    res => contractName in Object.fromEntries(res),
    `${contractName} instance is available`,
  );

  return { ...tools, deployBuilder, retryUntilCondition, wallets };
};

test.before(async t => (t.context = await makeTestContext(t)));

const makeAccountScenario = test.macro({
  title: (_, chainName) => `Create account on ${chainName}`,
  exec: async (t, chainName) => {
    assert.typeof(chainName, 'string');
    const config = chainConfig[chainName];
    if (!config) return t.fail(`Unknown chain: ${chainName}`);

    console.log('testing makeAccountScenario');
    const {
      wallets,
      provisionSmartWallet,
      vstorageClient,
      retryUntilCondition,
    } = t.context;

    const agoricAddr = wallets[chainName];
    console.log('agoricAddr:', agoricAddr);
    const wdUser1 = await provisionSmartWallet(agoricAddr, {
      BLD: 100n,
      IST: 100n,
    });
    t.log(`provisioning agoric smart wallet for ${agoricAddr}`);

    const doOffer = makeDoOffer(wdUser1);
    t.log(`${chainName} makeAccount offer`);
    const offerId = `${chainName}-makeAccount-${Date.now()}`;

    t.log('before doOffer');
    await doOffer({
      id: offerId,
      invitationSpec: {
        source: 'agoricContract',
        instancePath: [contractName],
        callPipe: [['makeAccountInvitation']],
      },
      offerArgs: { chainName },
      proposal: {},
    });
    // TODO fix above so we don't have to poll for the offer result to be published
    // https://github.com/Agoric/agoric-sdk/issues/9643
    const currentWalletRecord = await retryUntilCondition(
      () => vstorageClient.queryData(`published.wallet.${agoricAddr}.current`),
      ({ offerToPublicSubscriberPaths }) =>
        Object.fromEntries(offerToPublicSubscriberPaths)[offerId],
      `${offerId} continuing invitation is in vstorage`,
    );

    console.log('currentWalletRecord', currentWalletRecord);

    const offerToPublicSubscriberMap = Object.fromEntries(
      currentWalletRecord.offerToPublicSubscriberPaths,
    );

    const address = offerToPublicSubscriberMap[offerId]?.account
      .split('.')
      .pop();
    t.log('Got address:', address);
    t.regex(
      address,
      new RegExp(`^${config.expectedAddressPrefix}1`),
      `address for ${chainName} is valid`,
    );

    const latestWalletUpdate = await vstorageClient.queryData(
      `published.wallet.${agoricAddr}`,
    );
    t.log('latest wallet update', latestWalletUpdate);
    t.like(
      latestWalletUpdate.status,
      {
        id: offerId,
        numWantsSatisfied: 1,
        result: 'UNPUBLISHED',
        error: undefined,
      },
      'wallet offer satisfied without errors',
    );
  },
});

const makeCreateAndFundScenario = test.macro({
  title: (_, chainName, denom) =>
    `Create and fund account on ${chainName} with denom: ${denom}`,
  exec: async (t, chainName, denom) => {
    assert.typeof(chainName, 'string');
    const config = chainConfig[chainName];
    if (!config) return t.fail(`Unknown chain: ${chainName}`);

    console.log(
      `testing makeCreateAndFundScenario for chain ${chainName}, and denom ${denom}`,
    );
    const {
      wallets,
      provisionSmartWallet,
      vstorageClient,
      retryUntilCondition,
    } = t.context;

    const agoricAddr = wallets[chainName];
    console.log('agoricAddr:', agoricAddr);
    const wdUser1 = await provisionSmartWallet(agoricAddr, {
      BLD: 100n,
      IST: 100n,
    });

    t.log(`Provisioning Agoric smart wallet for ${agoricAddr}`);

    const doOffer = makeDoOffer(wdUser1);
    t.log(`${chainName} makeCreateAndFund offer`);
    const offerId = `${chainName}-makeCreateAndFund-${Date.now()}`;

    t.log('Before doOffer');

    const brands = await wdUser1.query.queryData('published.agoricNames.brand');
    const brand = Object.fromEntries(brands).BLD;

    const amount = AmountMath.make(brand, 10n);

    await doOffer({
      id: offerId,
      invitationSpec: {
        source: 'agoricContract',
        instancePath: [contractName],
        callPipe: [['makeCreateAndFundInvitation']],
      },
      offerArgs: { chainName, denom },
      proposal: {
        give: { Deposit: amount },
        want: {},
        exit: { onDemand: null },
      },
    });

    const currentWalletRecord = await retryUntilCondition(
      () => vstorageClient.queryData(`published.wallet.${agoricAddr}.current`),
      ({ offerToPublicSubscriberPaths }) =>
        Object.fromEntries(offerToPublicSubscriberPaths)[offerId],
      `${offerId} continuing invitation is in vstorage`,
    );

    const offerToPublicSubscriberMap = Object.fromEntries(
      currentWalletRecord.offerToPublicSubscriberPaths,
    );

    const address = offerToPublicSubscriberMap[offerId]?.account
      .split('.')
      .pop();
    t.log('got address:', address);
    t.regex(
      address,
      new RegExp(`^${config.expectedAddressPrefix}1`),
      `address for ${chainName} is valid`,
    );

    const latestWalletUpdate = await vstorageClient.queryData(
      `published.wallet.${agoricAddr}`,
    );
    t.log('latest wallet update', latestWalletUpdate);
    t.like(
      latestWalletUpdate.status,
      {
        id: offerId,
        numWantsSatisfied: 1,
        result: 'UNPUBLISHED',
        error: undefined,
      },
      'wallet offer satisfied without errors',
    );
  },
});

test.serial(makeAccountScenario, 'agoric');
test.serial(makeAccountScenario, 'cosmoshub');
test.serial(makeAccountScenario, 'osmosis');

// use IBC/E7827844CB818EE9C4DB2C159F1543FF62B26213B44CE8029D5CEFE52F0EE596
test.serial(makeCreateAndFundScenario, 'osmosis', 'ubld');
