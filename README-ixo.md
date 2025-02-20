# Add the IXO Impact Hub blockchain

## Requirements
- config.yaml - Edit the standard configuration to the specifications for ixolocal [(see config.yaml.ixo)](e2e-testing/config.yaml.ixo).
- create-genesis.sh - This file overrides the default create-genesis script with [the IXO create version](e2e-testing/scripts/ixo/create-genesis.sh).
- update-genesis.sh - This file overrides the default update-genesis script with [the IXO update version](e2e-testing/scripts/ixo/update-genesis.sh).

## Running locally
1. Download the latest IXO blockchain release, v3.0.0 in this example, and install the image locally.
```
docker pull ghcr.io/ixofoundation/ixo-blockchain:v3.0.0
```
2. Once the IXO Docker image is installed, run the following sequence of commands as part of the initial sequence described in the `dapp-orchestration-basics` README file.

In other words, refer to where the instructions say:
> - Follow the instructions in `agoric-sdk/multichain-testing/README.md` to setup local multi-chain environment needed to run and test dApp.

Navigate to the README file for `agoric-sdk/multichain-testing` and specifically the section that says:
> **Getting Started**

Do not use the `make start` command.
Instead, use the explicit commands in order to inject the IXO blockchain Docker image.

```
# clean up by removing the K8S cluster and all pods
make clean

# set up the cluster
make setup

# load the IXO blockchain image using Kind
kind load docker-image ghcr.io/ixofoundation/ixo-blockchain:v3.0.0 --name agship

# install helm chart and start starship service
make install

# wait for all pods to spin up
make wait-for-pods

# expose ports on your local machine (useful for testing dapps)
make port-forward

# set up Agoric testing environment
make fund-provision-pool override-chain-registry
```

From here, continue as normal and as described in the rest of the instructions.

## Notes
- The IXO blockchain Docker image does not contain the `jq` library therefore you'll notice the copious use of `sed` instead.
- Starship does not define IXO Impact Hub as a known chart and therefore we need to set the recipe name to `custom`.