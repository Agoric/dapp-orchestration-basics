import { test as anyTest } from '@agoric/zoe/tools/prepare-test-env-ava.js';
import { setUpZoeForTest } from '@agoric/zoe/tools/setup-zoe.js';
import { E, getInterfaceOf } from '@endo/far';
import path from 'path';
import {
  commonSetup,
  chainConfig,
} from './support.js';
import { makeDoOffer } from '../tools/e2e-tools.js';


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

    console.log("testing makeAccountScenario")
    const {
      wallets,
      provisionSmartWallet,
      vstorageClient,
      retryUntilCondition,
    } = t.context;

    const agoricAddr = wallets[chainName];
    const wdUser1 = await provisionSmartWallet(agoricAddr, {
      BLD: 100n,
      IST: 100n,
    });
    t.log(`provisioning agoric smart wallet for ${agoricAddr}`);

    const doOffer = makeDoOffer(wdUser1);
    t.log(`${chainName} makeAccount offer`);
    const offerId = `${chainName}-makeAccount-${Date.now()}`;

    t.log("before doOffer")
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

    console.log("currentWalletRecord", currentWalletRecord)

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

test.serial(makeAccountScenario, 'agoric');
test.serial(makeAccountScenario, 'cosmoshub');
test.serial(makeAccountScenario, 'osmosis');
