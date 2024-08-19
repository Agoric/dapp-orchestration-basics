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
basic-flow-deploy:
	make -C contract basic-flow-deploy
orca-deploy:
	make -C contract orca-deploy	