# Trouble Shooting Issues & their Solutions

1. SyntaxError#2: Unexpected token b in JSON at position 0
   confusing bundle ids for bundles, need to prepend with "@"

2. RangeError: Expected "[undefined]" is same as "Interface"
   endo/patterns issue

3. get E$1: undefined variable
   using another E import, because it gets stripped by the rollup older versions of dapps use

```javascript
import { E } from '@endo/far';
```

the rollup intends to strip that import:
https://github.com/Agoric/dapp-orchestration-basics/blob/921255ed33bd828843a89d73f64aeb82939dd78b/contract/rollup.config.mjs#L5-L7

4. SyntaxError: Possible HTML comment rejected at <unknown>:

```html
// ISSUE IMPORTING THIS, which promted yarn link: /* [!] (plugin
configureBundleID) TypeError: Failed to load module "./src/orchdev.contract.js"
in package "file:///Users/jovonni/Documents/projects/experiments/orca/contract/"
(1 underlying failures: Cannot find external module
"@agoric/orchestration/src/exos/stakingAccountKit.js" in package
file:///Users/jovonni/Documents/projects/experiments/orca/contract/
src/orchdev.proposal.js */
```

5. possible import rejection SES
   check for `bn.js` containing `while (j-- > 0) {`

we can check for this from outside the container:

```
kubectl exec -it agoriclocal-genesis-0 -- cat ./node_modules/bn.js/lib/bn.js | grep "j\-\-"
```

If the file is there, we can do `make copy-bn-js `

6.

```
v38: Error#1: privateArgs: (an undefined) - Must be a copyRecord to match a copyRecord pattern: {"marshaller":"[match:remotable]","orchestration":"[match:remotable]","storageNode":"[match:remotable]","timer":"[match:remotable]"}
```

ensure privateArgs adheres to the format

7.

```
privateArgs: timer: (an object) - Must be a remotable TimerService, not promise
```

ensure to pass the result of the promise, not the promise: `timer: await chainTimerService`

8.  ensure to install

```
yarn add typescript --dev
npm install -g rollup
```

9.

```
yarn add @agoric/vow@0.1.1-upgrade-16-fi-dev-8879538.0
yarn add @agoric/orchestration@0.1.1-upgrade-16-dev-d45b478.0
npm install rollup
```

10.

```
AssertionError [ERR_ASSERTION] [ERR_ASSERTION]: The expression evaluated to a falsy value:

    assert(refs.runnerChain)
```

11.

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

12.

```
v43: Error#1: Cannot find file for internal module "./src/exos/cosmosOrchestrationAccount.js" (with candidates "./src/exos/cosmosOrchestrationAccount.js", "./src/exos/cosmosOrchestrationAccount.js.js", "./src/exos/cosmosOrchestrationAccount.js.json", "
```

inspect the container, and look at the module in question:

```
head node_modules/@agoric/orchestration/package.json
```

double check the package.json `version`, to ensure resolution isn't overrriding a package on `yarn install` etc.

13.

```
xsnap: v52: Error: methodGuard: guard:methodGuard: (an object) - Must match one of [{"argGuards":"[match:arrayOf]","callKind":"sync","optionalArgGuards":"[match:or]","restArgGuard":"[match:or]","returnGuard":"[match:or]"},{"argGuards":"[match:arrayOf]","callKind":"async","optionalArgGuards":"[match:or]","restArgGuard":"[match:or]","returnGuard":"[Seen]"}]

```

Ensure

```javascript
makeAcountInvitationMaker: M.call().returns(M.promise()),
```

updated syntax:

```javascript
makeAccountInvitationMaker: M.callWhen().returns(InvitationShape);
```

14.

```
Cannot find file for internal module "./vat.js"
```

the version of `@agoric/vow` should be kept updated to `@dev` for now to keep up.

15.

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

16.

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

17.

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

18. If you see `x.js` can't be resolved from an `@agoric/...` npm package, there may be a version mismatch where that version isn't exporting said file. Should be fixed with more stable versions eventually.

19.

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
    async makeAccountInvitation() {
      // make sure NOT to use async here
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

20.

```js
await makeAccountInvitation() {
```

instead of:

```js
makeAccountInvitation() {
```

also the function signature that works is:

````js

/**
 * handler function for creating and managing accounts //* Xparam {object} offerArgs
 * @param {Orchestrator} orch
 * @param {undefined} _ctx
 * @param {ZCFSeat} seat
 * @param {{ chainName: string }} offerArgs
 */
const createAccountsFn = async (orch, _ctx, seat, {chainName}) => {```

some types were not correct
````

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

# noble/hashes

Dapps keep hitting this because registry uses starshipjs:

```js
import { useRegistry, useChain, ConfigContext } from 'starshipjs';
```

the error says:

```
AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:
```

reproducable here

```js
> await import("starshipjs");
> Uncaught:
> Error: Cannot find module 'dapp-orchestration-basics/node_modules/@noble/hashes/sha256.js'
```

steps to try to fix

Issue is sha256.ts exists, so we could just generate the js from it:

```
cd node_modules/@noble; npx tsc --init; npm install @noble/hashes; npx tsc; yarn; npm run build
```

then clean and try again

```
yarn cache clean; rm -rf -v node_modules ui/node_modules contract/node_modules; yarn cache clean; yarn
```

# HTTP body

this one reared its ugly head again after a while:
Error: error in json rpc client, with http response metadata: (Status: 400 Bad Request, Protocol HTTP/1.1). RPC error -32600 - Invalid Request: error reading request body: http: request body too large

remember we talked about maybe increasing the allowed body length or something..

hit when, maybe bundle grew:

```
kubectl exec -i agoriclocal-genesis-0 -c validator --tty=false -- agd tx swingset install-bundle @/tmp/contracts/b1-43c74d8a4bb5aa82267ba7a35b79eb3fe82e20f57f6ca9533df052f23fd30aada19478c7e61e078c81594699a190eb327119bce5b33d2d9bd0e8a58971aac387.json --gas auto --keyring-backend test --chain-id agoriclocal --from agoric1hm54wrxsv8e3pnw6lxj5lssfpexn48xtj6fhxw --broadcast-mode block --gas auto --gas-adjustment 1.4 --yes --output json
```

## solutions

1. revert this lines back inside `multichain-testing` `update-config.sh`:

```sh
echo "Increase $(*_bytes) parameters for MsgInstallBundle"
# See https://github.com/Agoric/agoric-sdk/blob/7b684a6268c999b082a326fdb22f63e4575bac4f/packages/agoric-cli/src/chain-config.js#L66
RPC_MAX_BODY_BYTES=15000000
MAX_HEADER_BYTES=$((RPC_MAX_BODY_BYTES / 10))
MAX_TXS_BYTES=$((RPC_MAX_BODY_BYTES * 50))
sed -i -e "s/max_body_bytes = .*/max_body_bytes = $RPC_MAX_BODY_BYTES/g" $CHAIN_DIR/config/config.toml
sed -i -e "s/max_header_bytes = .*/max_header_bytes = $MAX_HEADER_BYTES/g" $CHAIN_DIR/config/config.toml
sed -i -e "s/max_txs_bytes = .*/max_txs_bytes = $MAX_TXS_BYTES/g" $CHAIN_DIR/config/config.toml
sed -i -e "s/max_tx_bytes = .*/max_tx_bytes = $RPC_MAX_BODY_BYTES/g" $CHAIN_DIR/config/config.toml
sed -i -e "s/^rpc-max-body-bytes =.*/rpc-max-body-bytes = $RPC_MAX_BODY_BYTES/" $CHAIN_DIR/config/app.toml
```

2. Attempt to reduce bundle size by dedup, and removing comments
