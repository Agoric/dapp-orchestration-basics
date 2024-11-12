# TODO: figure out how to factor with e2e-testing/Makefile

CHAINID=agoriclocal
USER1ADDR=$(shell agd keys show alice -a --keyring-backend="test")
ACCT_ADDR=$(USER1ADDR)
BLD=000000ubld

ATOM_DENOM=ibc/BA313C4A19DFBF943586C0387E6B11286F9E416B4DD27574E6909CABE0E342FA
ATOM=000000$(ATOM_DENOM)

# your deployer address made from make add-address
# ADDR=agoric1k78s7qz7rxy8afyjrqk3dntg8m83zaw3upe60p
USERNAME ?= user1

ADDR := $(shell kubectl exec -i agoriclocal-genesis-0 -c validator -- sh -c '\
    if ! agd keys show $(USERNAME) >/dev/null 2>&1; then \
        agd keys add $(USERNAME) --output json; \
    else \
        agd keys show $(USERNAME) --output json; \
    fi' | jq -r ".address" \
)

$(info USERNAME is $(USERNAME))
$(info ADDR is $(ADDR))

PROVISION_POOL_ADDR=agoric1megzytg65cyrgzs6fvzxgrcqvwwl7ugpt62346

# `CLIENTADDR` is your address from your browser wallet that you will use to interact with the orchestration dapp. 
#`CLIENT_OSMO_ADDR` is the same, but your osmosis account.
CLIENTADDR=agoric12j5kzvrwunqvrga5vm4zpy3mkeh3lvyld0amz5
CLIENT_OSMO_ADDR=osmo1rhvgsqq96n3qyv3u0zlwleyaunpmal6uhnam4z

DEPLOY=npx --no-install tsx ../e2e-testing/scripts/deploy-cli.ts

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

check-balance:
	kubectl exec -i agoriclocal-genesis-0 -c validator -- agd q bank balances $(ADDR)

fund-wallet:
	kubectl exec -i agoriclocal-genesis-0 -c validator -- agd tx bank send faucet $(ADDR) 10000000000000uist -y -b block
	kubectl exec -i agoriclocal-genesis-0 -c validator -- agd tx bank send faucet $(ADDR) 10000000000000ubld -y -b block

provision-smart-wallet:
	kubectl exec -i agoriclocal-genesis-0 -c validator -- agd keys list
	kubectl exec -i agoriclocal-genesis-0 -c validator -- agd tx swingset provision-one wallet $(ADDR) SMART_WALLET --from ${ADDR} -y -b block

e2e:
	$(DEPLOY) src/builder/init-orca.js
