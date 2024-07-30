# Agoric Orchestration Basics Dapp

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

## Multichain-testing Makefile Helpers
You can add these commands to the bottom of the `multichain-testing` `Makefile` for now:
```Makefile

teardown: stop-forward stop clean delete

corepack-setup:
	corepack prepare yarn@4 --activate
corepack-enable:
	corepack enable 
test:
	yarn test test/install-contracts.test.ts

all: setup install
	sleep 3
	make port-forward
	sleep 120
	make fund-provision-pool
	sleep 10
	make add-address
	echo "done running"

hermes-update:
	kubectl exec -i hermes-agoric-osmosis-0 -c relayer -- hermes update client --host-chain agoriclocal --client 07-tendermint-1
	sleep 60
	make hermes-update
```



# Add a new address to the keychain inside of the kubernetes pod (for building/deploying inside of the pod)
From top level directory:
```
make add-address
```
paste address in the `Makefile` for `ADDR`.

# Fund the account
This will fund the pool, provision the smart wallet, and will also fund `CLIENTADDR` and `CLIENT_OSMO_ADDR`. `CLIENTADDR` is your address from your browser wallet that you will use to interact with the orchestration dapp. `CLIENT_OSMO_ADDR` is the same, but your osmosis account.

This can be ran from the top-level directory
```
make fund
```

# Build & Deploy the dapp
From the top level directory, run:
```
make
```

# Tests
From top-level directory:
```
make test-orca
```

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

# 