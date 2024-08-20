.DEFAULT_GOAL := build

e2e: build
	make -C contract build e2e

build:
	yarn workspace dapp-agoric-orca-contract build

redeploy:
	yarn workspace dapp-agoric-orca-contract deployc
