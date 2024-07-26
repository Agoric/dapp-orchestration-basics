# Simple Agoric ORChAstration Template

<img src="./images/orca2.png" width="100%" />

## Overview

The Orchestration Basics dApp showcases various features of the orchestration API running inside of an end-to-end environment, and a user interface:


# Interface
you can run `yarn dev` inside of the `ui` folder. 

<img src="./images/ui.png" width="100%" />


# Setting up the local environment
See `agoric-sdk/multichain-testing/README.md` for more setup instructions

you can run , run `agd status` to check if this was successful. If not try `make port-forward` again.

Once this is running, you need to also run `make override-chain-registry`. This will update vstorage to work with the local startship environment. 

From `agoric-sdk/multichain-testing`, you can use this command to restart your environment for any reason.
```
make teardown ; make stop; make stop-forward; make clean; make; make port-forward
```



# Add a new address to the keychain inside of the kubernetes pod (for building/deploying inside of the pod)
From top level directory:
```
make add-address
```
paste address in the `Makefile` for `ADDR`

# Fund the account
This will fund the pool, provision the smart wallet, and will also fund `CLIENTADDR` and `CLIENT_OSMO_ADDR`. This can be ran from the top-level directory
```
make fund
```

# Build & Deploy the dapp
From the top level directory, run:
```
make
```

# Issues & their Solutions
1) SyntaxError#2: Unexpected token b in JSON at position 0
confusing bundle ids for bundles, need to prepend with "@"


2) RangeError: Expected "[undefined]" is same as "Interface"
endo/patterns issue

3) get E$1: undefined variable
using another E import, because it gets stripped by the rollup older versions of dapps use
```javascript
import { E } from '@endo/far';
```

the rollup intends to strip that import:
https://github.com/Agoric/dapp-orchestration-basics/blob/921255ed33bd828843a89d73f64aeb82939dd78b/contract/rollup.config.mjs#L5-L7

4) SyntaxError: Possible HTML comment rejected at <unknown>:
```html
// ISSUE IMPORTING THIS, which promted yarn link: 
/*
    [!] (plugin configureBundleID) TypeError: Failed to load module "./src/orchdev.contract.js" in package "file:///Users/jovonni/Documents/projects/experiments/orca/contract/" (1 underlying failures: Cannot find external module "@agoric/orchestration/src/exos/stakingAccountKit.js" in package file:///Users/jovonni/Documents/projects/experiments/orca/contract/
src/orchdev.proposal.js
*/
```

5) possible import rejection SES
check for `bn.js` containing `while (j-- > 0) {`

we can check for this from outside the container:
```
kubectl exec -it agoriclocal-genesis-0 -- cat ./node_modules/bn.js/lib/bn.js | grep "j\-\-"
```

If the file is there, we can do `make copy-bn-js `

6) 
```
v38: Error#1: privateArgs: (an undefined) - Must be a copyRecord to match a copyRecord pattern: {"marshaller":"[match:remotable]","orchestration":"[match:remotable]","storageNode":"[match:remotable]","timer":"[match:remotable]"}
```
ensure privateArgs adheres to the format

7) 
```
privateArgs: timer: (an object) - Must be a remotable TimerService, not promise
```
ensure to pass the result of the promise, not the promise: `timer: await chainTimerService`

8) 
ensure to install
```
yarn add typescript --dev
npm install -g rollup
```

9)
```
yarn add @agoric/vow@0.1.1-upgrade-16-fi-dev-8879538.0
yarn add @agoric/orchestration@0.1.1-upgrade-16-dev-d45b478.0
npm install rollup
```

10)
```
AssertionError [ERR_ASSERTION] [ERR_ASSERTION]: The expression evaluated to a falsy value:

    assert(refs.runnerChain)
```

11)
```
  AssertionError [ERR_ASSERTION] [ERR_ASSERTION]: The expression evaluated to a falsy value:
```
`"@endo/patterns": "^1.4.0"` throws this error when used in devdependencies, when running tests, just remove

Note: also remove all resolutions from root package.json, especially if you see this:
```
Uncaught exception in test/test-deploy-tools.js

  RangeError: Expected "[undefined]" is same as "Interface"

  ✘ test/test-deploy-tools.js exited with a non-zero exit code: 1

  Uncaught exception in test/test-orca-contract.js

  RangeError: Expected "[undefined]" is same as "Interface"

  Uncaught exception in test/test-bundle-source.js

  RangeError: Expected "[undefined]" is same as "Interface"

  ✘ No tests found in test/test-build-proposal.js
  ✘ test/test-orca-contract.js exited with a non-zero exit code: 1
  ✘ test/test-bundle-source.js exited with a non-zero exit code: 1
  ─
```

12) 
```
v43: Error#1: Cannot find file for internal module "./src/exos/cosmosOrchestrationAccount.js" (with candidates "./src/exos/cosmosOrchestrationAccount.js", "./src/exos/cosmosOrchestrationAccount.js.js", "./src/exos/cosmosOrchestrationAccount.js.json", "
```

inspect the container, and look at the module in question:
```
head node_modules/@agoric/orchestration/package.json
```

double check the package.json `version`, to ensure resolution isn't overrriding a package on `yarn install` etc.

13)
```
xsnap: v52: Error: methodGuard: guard:methodGuard: (an object) - Must match one of [{"argGuards":"[match:arrayOf]","callKind":"sync","optionalArgGuards":"[match:or]","restArgGuard":"[match:or]","returnGuard":"[match:or]"},{"argGuards":"[match:arrayOf]","callKind":"async","optionalArgGuards":"[match:or]","restArgGuard":"[match:or]","returnGuard":"[Seen]"}]

```

Ensure 
```javascript
makeAcountInvitationMaker: M.call().returns(M.promise()),
```
updated syntax:
```javascript
makeAccountInvitationMaker: M.callWhen().returns(InvitationShape)
```

14) 
```
Cannot find file for internal module "./vat.js"
```

the version of `@agoric/vow` should be kept updated to `@dev` for now to keep up.

15)
```
ReferenceError#1: accountsStorageNode: get E: undefined variable
```

Make sure `privateArgs` adheres to the correct shape expected or else any subsequent call to something like this will fail:

```javascript
E(storageNode).makeChildNode('accounts'),
```

```javascript
export const meta = harden({
  privateArgsShape: {
    orchestration: M.remotable('orchestration'),
    storageNode: StorageNodeShape,
    marshaller: M.remotable('marshaller'),
    timer: TimerServiceShape,
  },
});
export const privateArgsShape = meta.privateArgsShape;
```

16) 
```
Error#1: redefinition of durable kind " Durable Publish Kit "
```

```javascript
const { makeRecorderKit } = prepareRecorderKitMakers(baggage, marshaller);
```
it throwing this error. `provideOrchestration` also calls `prepareRecorderKitMakers`. Also ensure the `remotePowers` has the following keys:
```javascript
orchestrationService: remotePowers.orchestration,
timerService: remotePowers.timer,
```

Because `makeOrchestrationFacade` expects the following remotePowers structure:
```javascript
/**
 *
 * @param {{
 *   zone: Zone;
 *   timerService: Remote<TimerService> | null;
 *   zcf: ZCF;
 *   storageNode: Remote<StorageNode>;
 *   orchestrationService: Remote<OrchestrationService> | null;
 *   localchain: Remote<LocalChain>;
 * }} powers
```

17)
```
TypeError: orchestrate: no function
```

If i log `asyncFlowTools`:
```
asyncFlowTools
2024-06-30T02:33:01.781Z SwingSet: vat: v38: { prepareAsyncFlowKit: [Function: prepareAsyncFlowKit], asyncFlow: [Function: asyncFlow], adminAsyncFlow: Object [Alleged: AdminAsyncFlow] {}, allWokenP: Promise [Promise] {} }
```

```
{
  "name": "@agoric/async-flow",
  "version": "0.1.1-upgrade-16-fi-dev-8879538.0+8879538",
```

this is the `orchestrate` function in `@agoric/orchestration@0.1.1-upgrade-16-fi-dev-8879538.0+8879538`
```javascript
orchestrate(durableName, ctx, fn) {
    /** @type {Orchestrator} */
    const orc = {
    async getChain(name) {
        if (name === 'agoric') {
        return makeLocalChainFacade(localchain);
        }
        return makeRemoteChainFacade(name);
    },
    makeLocalAccount() {
        return E(localchain).makeAccount();
    },
    getBrandInfo: anyVal,
    asAmount: anyVal,
    };
    return async (...args) => fn(orc, ctx, ...args);
},
```

Here is the same `orchestrate` function in `@agoric/orchestration@00.1.1-dev-6bc363b.0+6bc363b`:

```javascript
orchestrate(durableName, hostCtx, guestFn) {
    const subZone = zone.subZone(durableName);
    const hostOrc = makeOrchestrator();
    const [wrappedOrc, wrappedCtx] = prepareEndowment(subZone, 'endowments', [
    hostOrc,
    hostCtx,
    ]);
    const hostFn = asyncFlow(subZone, 'asyncFlow', guestFn);
    const orcFn = (...args) =>
    // TODO remove the `when` after fixing the return type
    // to `Vow<HostReturn>`
    when(hostFn(wrappedOrc, wrappedCtx, ...args));
    return harden(orcFn);
},
```

Hypothesis: `prepareEndowment` doesn't exist, so version issue


18)
If you see `x.js` can't be resolved from an `@agoric/...` npm package, there may be a version mismatch where that version isn't exporting said file. Should be fixed with more stable versions eventually. 

19)
```
Error#1: In "makeAccountInvitation" method of (OrcaFacet): result: (an object) - Must be a remotable Invitation, not promise
```

ensure your public facet returns the result of a promise, not the promise:

```javascript
const publicFacet = zone.exo(
  'OrcaFacet',
  M.interface('OrcaFacet', {
    makeAccountInvitation: M.call().returns(M.promise()),
  }),
  {
    async makeAccountInvitation() { // make sure NOT to use async here
      const invitation = await zcf.makeInvitation(
        createAccounts,
        'Create accounts',
        undefined,
        harden({
          give: {},
          want: {},
          exit: M.any(),
        }),
      );
      return invitation;
    },
  },
);

```

```
2024-07-01T19:16:10.669Z SwingSet: vat: v104: Warning for now: vow expected, not promise Promise [Promise] {} (Error#1)
2024-07-01T19:16:10.739Z SwingSet: xsnap: v104: Error#2: value for vow is not durable: slot 0 of { body: '#{"#tag":"Vow","payload":{"vowV0":"$0.Alleged: VowInternalsKit vowV0"}}', slots: [ 'o+40' ] }
2024-07-01T19:16:10.739Z SwingSet: xsnap: v104: Error: value for (a string) is not durable: slot 0 of (an object)
```

Make sure the offer handlers are in the top-level scope, so they don't inherit any "side effects"




20)
```js
await makeAccountInvitation() {
```
instead of:
```js
makeAccountInvitation() {
```

also the function signature that works is:
```js

/**
 * handler function for creating and managing accounts //* Xparam {object} offerArgs
 * @param {Orchestrator} orch
 * @param {undefined} _ctx
 * @param {ZCFSeat} seat
 * @param {{ chainName: string }} offerArgs
 */
const createAccountsFn = async (orch, _ctx, seat, {chainName}) => {```

some types were not correct
```

Then also, fron the client:

```js
wallet?.makeOffer(
    {
      source: 'contract',
      instance, 
      publicInvitationMaker: 'makeOrchAccountInvitation',
      // publicInvitationMaker: 'makeAccountInvitation',
      // source: 'agoricContract',
      // instancePath: ['basicFlows'],
      // callPipe: [['makeOrchAccountInvitation']],
    },
    { give, want },
    { chainName: "osmosis"},
```

The offerArgs was empty



# tests from root directory
```
yarn cache clean; yarn; yarn workspace dapp-agoric-orca-contract test ; rm -rf -v yarn.lock package-lock.json node_modules contract/node_modules; yarn; yarn workspace dapp-agoric-orca-contract test
```

without clean:
```
yarn workspace dapp-agoric-orca-contract deploy
```

# deploy from root directory 
```
yarn cache clean; yarn; yarn workspace dapp-agoric-orca-contract test ; rm -rf -v yarn.lock package-lock.json node_modules contract/node_modules; yarn; yarn workspace dapp-agoric-orca contract:deploy
```

without clean:
```
yarn workspace dapp-agoric-orca-contract deploy
```

# e2e build/deploy
```
yarn workspace dapp-agoric-orca-contract deployc
```

# e2e environment using `multichain-testing`
using starship
```
make teardown ; make stop; make stop-forward; make clean; make; make port-forward
```

# e2e workspaces
```
yarn workspace dapp-agoric-orca-contract build; yarn workspace dapp-agoric-orca-contract e2e
```

# note
Troubleshooting remote calls

If an ordinary synchronous call (obj.method()) fails because the method doesn't exist, the obj may be remote, in which case E(obj).method() might work.

# ensure to override the chain registry (from inside multichain-testing):

```
yarn build (from agoric-sdk root)
make override-chain-registry
```

# funding on osmosis
```console
osmosisd tx bank send faucet osmo1dw3nep8yqy5szzxn6hmma6j2z77vp4wz8tkh0w3gyrruwny0w03s070kaa 299999999uosmo --chain-id osmosislocal --gas-adjustment 2 --gas auto --from faucet --gas-prices 0.0025uosmo
```

example rpc for balances:
```
http://127.0.0.1:26657/abci_query?path=%22/cosmos.bank.v1beta1.Query/AllBalances%22&data=%22%5Cn-agoric12j5kzvrwunqvrga5vm4zpy3mkeh3lvyld0amz5%22
```

# tmp fund ica
```console
agd tx bank send keplr1 agoric15ch7da0d8nvqc8hk6dguq4ext0lvskpjcwm3patf8sygm63chmpqjlzt74 1000uist -y --chain-id agoriclocal
```