EXEC_OSMO = kubectl exec -i hermes-agoric-osmosis-0 -c relayer --

e2e: build build
	yarn workspace dapp-agoric-orca-contract test; yarn workspace dapp-agoric-orca-contract build; yarn workspace dapp-agoric-orca-contract e2e
build:
	yarn workspace dapp-agoric-orca-contract test; yarn workspace dapp-agoric-orca-contract build;
redeploy:
	yarn workspace dapp-agoric-orca-contract deployc
test-orca:
	yarn workspace dapp-agoric-orca-contract test
fund:
	yarn workspace  dapp-agoric-orca-contract fund
add-address:
	yarn workspace  dapp-agoric-orca-contract add:address
lint:
	yarn workspace dapp-agoric-orca-contract lint
hermes-update:
	$(EXEC_OSMO) hermes update client --host-chain agoriclocal --client 07-tendermint-1 || { \
	echo "'07-tendermint-1' failed, trying '07-tendermint-0'..."; \
	$(EXEC_OSMO) hermes update client --host-chain agoriclocal --client 07-tendermint-0; \
	}

	sleep 60
	make hermes-update