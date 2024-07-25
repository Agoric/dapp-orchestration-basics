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
