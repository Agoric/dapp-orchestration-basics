import { test as anyTest } from '@agoric/zoe/tools/prepare-test-env-ava.js';
import { setUpZoeForTest } from '@agoric/zoe/tools/setup-zoe.js';
import { E, getInterfaceOf } from '@endo/far';
import path from 'path';
import { commonSetup } from './tools/supports.js';

const dirname = path.dirname(new URL(import.meta.url).pathname);

const contractName = 'basic-flows';
console.log({ dirname })
const contractFile = `${dirname}/../../src/flows/${contractName}.contract.js`;

const test = anyTest;

test.before(async t => {
  t.log({
    VatData
  })
  const setupContext = await commonSetup(t);
  const {
    bootstrap: { storage },
    commonPrivateArgs,
  } = setupContext;

  const { zoe, bundleAndInstall } = await setUpZoeForTest();

  // t.log('contract coreEval', contractName);
  const installation = await bundleAndInstall(contractFile);

  const storageNode = await E(storage.rootNode).makeChildNode(contractName);
  const { instance } = await E(zoe).startInstance(
    installation,
    undefined,
    {},
    { ...commonPrivateArgs, storageNode },
  );

  t.context = {
    ...setupContext,
    zoe,
    installation,
    instance,
  };
});

test('test', t => {
  t.pass()
});

const chainConfigs = {
  agoric: { addressPrefix: 'agoric1fakeLCAAddress' },
  cosmoshub: { addressPrefix: 'cosmos1test' },
};

const orchestrationAccountScenario = test.macro({
  title: (_, chainName) =>
    `orchestrate - ${chainName} makeOrchAccount returns a ContinuingOfferResult`,
  exec: async (t, chainName) => {
    const config = chainConfigs[chainName];
    if (!config) {
      return t.fail(`Unknown chain: ${chainName}`);
    }

    const {
      bootstrap: { vowTools: vt },
      zoe,
      instance,
    } = t.context;
    const publicFacet = await E(zoe).getPublicFacet(instance);
    const inv = E(publicFacet).makeOrchAccountInvitation();
    const userSeat = E(zoe).offer(inv, {}, undefined, { chainName });
    const { invitationMakers, publicSubscribers } = await vt.when(
      E(userSeat).getOfferResult(),
    );

    t.regex(getInterfaceOf(invitationMakers), /invitationMakers/);

    const { description, storagePath, subscriber } = publicSubscribers.account;
    t.regex(description, /Account holder/);

    const expectedStoragePath = `mockChainStorageRoot.basic-flows.${config.addressPrefix}`;
    t.is(storagePath, expectedStoragePath);

    t.regex(getInterfaceOf(subscriber), /Durable Publish Kit subscriber/);
  },
});

test(orchestrationAccountScenario, 'agoric');
test(orchestrationAccountScenario, 'cosmoshub');