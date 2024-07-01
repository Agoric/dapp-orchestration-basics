# Simple Agoric ORChAstration Template

<img src="./images/orca2.png" width="100%" />

## Overview

e2e

# 1
from multitest, run `agd status` to check
```
make teardown ; make stop; make stop-forward; make clean; make; make port-forward
```

```
ramp swift rich agree then brown blur dentist come replace describe thumb confirm faint seat cabbage receive cement coyote quick thrive ramp horse name
```

# 2
```
make add-address
```
paste address in makefile for `ADDR`

# 3 
```
make fund
```

<!-- # 4 
```
make start
``` -->

# 4 v2
```
make start-contract-orca-v3
```

# 5 
```
make proposal-start
```

# 6 vote for start
```
make proposal-start-vote
```

# debug bundle
```
make bundle-debug
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

# note
Troubleshooting remote calls

If an ordinary synchronous call (obj.method()) fails because the method doesn't exist, the obj may be remote, in which case E(obj).method() might work.


