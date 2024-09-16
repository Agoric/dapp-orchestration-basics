# TODO: figure out how to factor with e2e-testing/Makefile

CHAINID=agoriclocal
USER1ADDR=$(shell agd keys show alice -a --keyring-backend="test")
ACCT_ADDR=$(USER1ADDR)
BLD=000000ubld

ATOM_DENOM=ibc/BA313C4A19DFBF943586C0387E6B11286F9E416B4DD27574E6909CABE0E342FA
ATOM=000000$(ATOM_DENOM)

# your deployer address made from make add-address
# ADDR=agoric1k78s7qz7rxy8afyjrqk3dntg8m83zaw3upe60p
ADDR=agoric125d8s0tamx50gpqdd3m7f5gtkzkcnjs0ehsujr

PROVISION_POOL_ADDR=agoric1megzytg65cyrgzs6fvzxgrcqvwwl7ugpt62346

PROPOSAL=1
VOTE_OPTION=yes

# `CLIENTADDR` is your address from your browser wallet that you will use to interact with the orchestration dapp. 
#`CLIENT_OSMO_ADDR` is the same, but your osmosis account.
CLIENTADDR=agoric12j5kzvrwunqvrga5vm4zpy3mkeh3lvyld0amz5
CLIENT_OSMO_ADDR=osmo1rhvgsqq96n3qyv3u0zlwleyaunpmal6uhnam4z

DEPLOY=npx --no-install tsx ../e2e-testing/scripts/deploy-cli.ts

.PHONY: list
# https://stackoverflow.com/a/73159833/7963
list:
	@make -npq : 2> /dev/null | grep -v PHONY |\
		awk -v RS= -F: '$$1 ~ /^[^#%]+$$/ { print $$1 }'

balance-q:
	agd keys show alice -a --keyring-backend="test"
	agd query bank balances $(ACCT_ADDR)

GAS_ADJUSTMENT=1.2
SIGN_BROADCAST_OPTS=--keyring-backend=test --chain-id=$(CHAINID) \
		--gas=auto --gas-adjustment=$(GAS_ADJUSTMENT) \
		--yes -b block

mint100:
	make FUNDS=1000$(ATOM) fund-acct
	cd /usr/src/agoric-sdk && \
		yarn --silent agops vaults open --wantMinted 100 --giveCollateral 100 >/tmp/want-ist.json && \
		yarn --silent agops perf satisfaction --executeOffer /tmp/want-ist.json --from alice --keyring-backend=test

# Keep mint4k around a while for compatibility
mint4k:
	make FUNDS=1000$(ATOM) fund-acct
	cd /usr/src/agoric-sdk && \
		yarn --silent agops vaults open --wantMinted 4000 --giveCollateral 1000 >/tmp/want4k.json && \
		yarn --silent agops perf satisfaction --executeOffer /tmp/want4k.json --from alice --keyring-backend=test

FUNDS=321$(BLD)
fund-acct:
	agd tx bank send alice $(ACCT_ADDR) $(FUNDS) \
	  $(SIGN_BROADCAST_OPTS) \
	  -o json >,tx.json
	jq '{code: .code, height: .height}' ,tx.json

gov-q:
	agd query gov proposals --output json | \
		jq -c '.proposals[] | [.proposal_id,.voting_end_time,.status]'

gov-voting-q:
	agd query gov proposals --status=voting_period --output json | \
		jq -c '.proposals[].proposal_id'

vote:
# agd tx gov vote $(PROPOSAL) $(VOTE_OPTION) --from=validator 
	agd tx gov vote $(PROPOSAL) $(VOTE_OPTION) --from=alice \
	  $(SIGN_BROADCAST_OPTS) \
	  -o json >,tx.json
	jq '{code: .code, height: .height}' ,tx.json

instance-q:
	agd query vstorage data published.agoricNames.instance -o json

start: start-contract-orca



# bundle-X.json.installed show that bundle-X.json was installed
# see also e2e-tools.js
%.json.installed: %.json
	@echo '{"up-to-date": false}'

# X.js.done shows that X.js core eval ran
%.js.done: %.js
	@echo '{"up-to-date": false}'

# Dependencies to re-run core eval when source changes
# NOTE: manually updated
bundles/deploy-send.js: src/start-postalSvc.js
	@echo '{"up-to-date": false}'

bundles/deploy-swaparoo.js: src/swaparoo.proposal.js
	@echo '{"up-to-date": false}'

clean:
	@rm -rf bundles/



########################################
########################################
################ Dapp dev
########################################
########################################

# HARD CODED
cpfiles:
	kubectl cp bundles/deploy-board-aux-permit.json default/agoriclocal-genesis-0:/root/bundles/deploy-board-aux-permit.json
	kubectl cp bundles/deploy-board-aux.js default/agoriclocal-genesis-0:/root/bundles/deploy-board-aux.js
	kubectl cp bundles/deploy-orca-permit.json default/agoriclocal-genesis-0:/root/bundles/deploy-orca-permit.json
	kubectl cp bundles/deploy-orca.js default/agoriclocal-genesis-0:/root/bundles/deploy-orca.js
	kubectl cp bundles/bundle-orca.js default/agoriclocal-genesis-0:/root/bundles/bundle-orca.js
	kubectl cp bundles/bundle-list-ship default/agoriclocal-genesis-0:/root/bundles/bundle-list-ship

	kubectl cp scripts/build-proposal.sh default/agoriclocal-genesis-0:/root/scripts/build-proposal.sh
	kubectl cp scripts/install-bundles.sh default/agoriclocal-genesis-0:/root/scripts/install-bundles.sh
	kubectl cp scripts/propose-start-contract.sh default/agoriclocal-genesis-0:/root/scripts/propose-start-contract.sh
	kubectl cp ./src/platform-goals/start-contract.js default/agoriclocal-genesis-0:/root/scripts/start-contract.js
	kubectl cp scripts/build-contract-deployer.js default/agoriclocal-genesis-0:/root/scripts/build-contract-deployer.js
	

	kubectl cp ./Makefile default/agoriclocal-genesis-0:/root/Makefile
rmfiles:
	kubectl exec -i agoriclocal-genesis-0 -c validator -- rm -rf ./bundles/bundle-orca.json
	kubectl exec -i agoriclocal-genesis-0 -c validator -- rm -rf ./bundles/deploy-board-aux-permit.json
	kubectl exec -i agoriclocal-genesis-0 -c validator -- rm -rf ./bundles/deploy-board-aux.js
	kubectl exec -i agoriclocal-genesis-0 -c validator -- rm -rf ./bundles/deploy-orca-permit.json
	kubectl exec -i agoriclocal-genesis-0 -c validator -- rm -rf ./bundles/deploy-orca.js

	kubectl exec -i agoriclocal-genesis-0 -c validator -- rm -rf ./scripts/build-proposal.sh
	kubectl exec -i agoriclocal-genesis-0 -c validator -- rm -rf ./scripts/install-bundles.sh
	kubectl exec -i agoriclocal-genesis-0 -c validator -- rm -rf ./scripts/propose-start-contract.sh

	kubectl exec -i agoriclocal-genesis-0 -c validator -- rm -rf ./bundles/bundle-list-ship
	kubectl exec -i agoriclocal-genesis-0 -c validator -- rm -rf ./Makefile
	kubectl exec -i agoriclocal-genesis-0 -c validator -- rm -rf ./bundles/*.json
	kubectl exec -i agoriclocal-genesis-0 -c validator -- rm -rf ./bundles/*.js
	kubectl exec -i agoriclocal-genesis-0 -c validator -- rm -rf ./scripts/*.js



# 1
fund-provision-pool:
	kubectl exec -i agoriclocal-genesis-0 -c validator -- agd tx bank send faucet $(PROVISION_POOL_ADDR) 1000000000uist -y -b block;
	sleep 5;

# 2
fund: fund-provision-pool check-balance
	make fund-wallet;
	make check-balance;
	make provision-smart-wallet;
	kubectl exec -i agoriclocal-genesis-0 -c validator -- agd tx bank send faucet ${CLIENTADDR} 10000000000000ubld -y;
	sleep 5;
	kubectl exec -i agoriclocal-genesis-0 -c validator -- agd tx bank send faucet ${CLIENTADDR} 10000000000000uist -y;
	make fund-osmo

fund-osmo:
	kubectl exec -i osmosislocal-genesis-0 -c validator -- osmosisd tx bank send faucet ${CLIENT_OSMO_ADDR} 9870000000uosmo --fees 1000uosmo -y;

fund-osmo-ibc:
	kubectl exec -i osmosislocal-genesis-0 -c validator -- osmosisd tx ibc-transfer transfer transfer channel-0 ${CLIENTADDR} 1000000uosmo --from faucet --chain-id osmosislocal --node http://127.0.0.1:26657 --fees 5000uosmo -y;
	kubectl exec -i osmosislocal-genesis-0 -c validator -- osmosisd tx ibc-transfer transfer transfer channel-1 ${CLIENTADDR} 1000000uosmo --from faucet --chain-id osmosislocal --node http://127.0.0.1:26657 --fees 5000uosmo -y;

check-balance:
	kubectl exec -i agoriclocal-genesis-0 -c validator -- agd q bank balances $(ADDR)
fund-wallet:
	kubectl exec -i agoriclocal-genesis-0 -c validator -- agd tx bank send faucet $(ADDR) 10000000000000uist -y -b block
	kubectl exec -i agoriclocal-genesis-0 -c validator -- agd tx bank send faucet $(ADDR) 10000000000000ubld -y -b block

provision-smart-wallet:
	kubectl exec -i agoriclocal-genesis-0 -c validator -- agd keys list
	kubectl exec -i agoriclocal-genesis-0 -c validator -- agd tx swingset provision-one wallet $(ADDR) SMART_WALLET --from ${ADDR} -y -b block

local-provision-smart-wallet:
	agd tx swingset provision-one wallet $(ADDR) SMART_WALLET --from $(ADDR) -y -b block  --chain-id agoriclocal

fund-dev:
	kubectl exec -i agoriclocal-genesis-0 -c validator -- agd tx bank send alice agoric1rwwley550k9mmk6uq6mm6z4udrg8kyuyvfszjk 100000000ubld -y
	kubectl exec -i agoriclocal-genesis-0 -c validator -- agd tx bank send alice agoric1rwwley550k9mmk6uq6mm6z4udrg8kyuyvfszjk 100000000uist -y
local-fund:
	agd tx bank send faucet $(ADDR) 999999999ubld -y
	agd tx bank send faucet $(ADDR) 999999999uist -y
# add address
add-address:
	kubectl exec -i agoriclocal-genesis-0 -c validator -- agd keys add alice || true


exec:
	kubectl exec -it agoriclocal-genesis-0 -c validator -- bash

# 1
install-bundles:
	bash scripts/install-bundles.sh

# copy bundle to container
cpb: 
	bash scripts/copy-bundles-to-container.sh
	

copy-project:
	kubectl exec -i agoriclocal-genesis-0 -c validator -- rm -rf -v ./*
	kubectl exec -i agoriclocal-genesis-0 -c validator -- mkdir -p /root/
	kubectl cp . default/agoriclocal-genesis-0:/root/

PROPOSAL_ID=3
propose-start-v2: 
	make make-proposal-start;
	sleep 3;
	make proposal-start-vote;
	make sleep 3;
	make gov-q;

make-proposal-start:
	kubectl exec -i agoriclocal-genesis-0 -c validator -- bash -c "make propose-start";
	sleep 3; make gov-q

proposal-start-vote:
	kubectl exec -i agoriclocal-genesis-0 -c validator -- bash -c "agd tx gov vote ${PROPOSAL_ID} $(VOTE_OPTION) --from=genesis $(SIGN_BROADCAST_OPTS) -o json >,tx.json ; jq '{code: .code, height: .height}' ,tx.json"

# debug bundle
bundle-debug:
	bash scripts/bundle-debug.sh

# patch
copy-bn-js:
	kubectl exec -i agoriclocal-genesis-0 -c validator -- rm -f -v /root/node_modules/bn.js/lib/bn.js
	cp ./PATCH-bn.js ../node_modules/bn.js/lib/bn.js
	kubectl cp ../node_modules/bn.js/lib/bn.js default/agoriclocal-genesis-0:/root/node_modules/bn.js/lib/bn.js

copy-vow-js:
	cp ./PATCH-vat.js ../node_modules/@agoric/vow/vat.js
	kubectl cp ../node_modules/@agoric/vow/vat.js default/agoriclocal-genesis-0:/root/node_modules/@agoric/vow/vat.js

# debug
# kubectl cp ../node_modules/@agoric/vow/vat.js default/agoriclocal-genesis-0:/root/node_modules/@agoric/orchestration/node_modules/@agoric/vow/vat.js
# kubectl cp ../node_modules/@agoric/vow/vat.js default/agoriclocal-genesis-0:/root/node_modules/@agoric/async-flow/node_modules/@agoric/vow/vat.js


# kubectl exec -i agoriclocal-genesis-0 -c validator -- cat /root/node_modules/bn.js/lib/bn.js | grep "PATCH"
patch: 
	patch ../node_modules/bn.js/lib/bn.js < ../xxpatches/bn.js+5.2.1.patch

cleanc:
	kubectl exec -i agoriclocal-genesis-0 -c validator -- bash -c "rm -rf -v ./*"

build:
	yarn build:deployer
buildc:
	kubectl exec -i agoriclocal-genesis-0 -c validator -- bash -c "yarn build:deployer"
deployc:
	kubectl exec -i agoriclocal-genesis-0 -c validator -- bash -c "yarn node scripts/deploy-contract.js --install src/orca.contract.js --eval src/orca.proposal.js"
deploy:
	yarn node scripts/deploy-contract.js --install src/orca.contract.js --eval src/orca.proposal.js
test-orca:
	yarn test ./test/orca-contract.test.js


# todo remove clean install steps after debugging
e2e:
	$(DEPLOY) src/builder/init-orca.js
lint:
	yarn lint --fix-dry-run --ignore-pattern "*patch*" 

