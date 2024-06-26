# Simple Agoric ORChAstration Template

<img src="./images/orca.png" width="100%" />

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
paste address in makefile for ADDR

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

# Issues
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

# note
Troubleshooting remote calls

If an ordinary synchronous call (obj.method()) fails because the method doesn't exist, the obj may be remote, in which case E(obj).method() might work.


