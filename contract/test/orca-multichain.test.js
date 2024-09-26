import { test as anyTest } from '@agoric/zoe/tools/prepare-test-env-ava.js';
import { setUpZoeForTest } from '@agoric/zoe/tools/setup-zoe.js';
import { E, getInterfaceOf } from '@endo/far';
import path from 'path';
import { commonSetup, chainConfig } from './support.js';
import { makeDoOffer } from '../tools/e2e-tools.js';
import { AmountMath, makeIssuerKit } from '@agoric/ertp';

const test = anyTest;

const accounts = ['agoric', 'cosmoshub', 'osmosis'];

const contractName = 'orca';
const contractBuilder = './test/builder/init-orca.js';

test.before(async t => {
  const { deleteTestKeys, setupTestKeys, ...rest } = await commonSetup(t);
  deleteTestKeys(accounts).catch();
  const wallets = await setupTestKeys(accounts);
  t.context = { ...rest, wallets, deleteTestKeys };

  t.log('bundle and install contract', contractName);
  await t.context.deployBuilder(contractBuilder);
  const { vstorageClient } = t.context;
  await t.context.retryUntilCondition(
    () => vstorageClient.queryData(`published.agoricNames.instance`),
    res => contractName in Object.fromEntries(res),
    `${contractName} instance is available`,
  );
});

test.after(async t => {
  const { deleteTestKeys } = t.context;
  deleteTestKeys(accounts);
});

const makeAccountScenario = test.macro({
  title: (_, chainName) => `Create account on ${chainName}`,
  exec: async (t, chainName) => {
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
