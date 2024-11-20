#!/bin/bash

set -eux

echo "START OF CUSTOM UPDATE-GENESIS SCRIPT"

DENOM="${DENOM:=uixo}"
CHAIN_DIR="/ixo/.ixod"

ls $CHAIN_DIR/config

echo "Update genesis.json file with updated local params"
sed -i -e "s/\"stake\"/\"$DENOM\"/g" $CHAIN_DIR/config/genesis.json
sed -i "s/\"time_iota_ms\": \".*\"/\"time_iota_ms\": \"$TIME_IOTA_MS\"/" $CHAIN_DIR/config/genesis.json
# Update initial balances to match staking amount
sed -i 's/"amount": "10"/"amount": "100000000000000"/g' $CHAIN_DIR/config/genesis.json


echo "Update max gas param"
sed -i 's/"max_gas": "[^"]*"/"max_gas": "100000000000"/' $CHAIN_DIR/config/genesis.json

echo "Update staking unbonding time and slashing jail time"
sed -i 's/"unbonding_time": "[^"]*"/"unbonding_time": "300s"/' $CHAIN_DIR/config/genesis.json
sed -i 's/"downtime_jail_duration": "[^"]*"/"downtime_jail_duration": "60s"/' $CHAIN_DIR/config/genesis.json

# overrides for older sdk versions, before 0.47
# IXO chain currently uses v45
function gov_overrides_sdk_v46() {
    sed -i 's/"max_deposit_period": "[^"]*"/"max_deposit_period": "30s"/' $CHAIN_DIR/config/genesis.json
    # sed -i 's/"amount": "[^"]*"/"amount": "10"/' $CHAIN_DIR/config/genesis.json
    sed -i 's/"voting_period": "[^"]*"/"voting_period": "30s"/' $CHAIN_DIR/config/genesis.json
    sed -i 's/"quorum": "[^"]*"/"quorum": "0.000000000000000000"/' $CHAIN_DIR/config/genesis.json
    sed -i 's/"threshold": "[^"]*"/"threshold": "0.000000000000000000"/' $CHAIN_DIR/config/genesis.json
    sed -i 's/"veto_threshold": "[^"]*"/"veto_threshold": "0.000000000000000000"/' $CHAIN_DIR/config/genesis.json
}

# overrides for newer sdk versions, post 0.47
function gov_overrides_sdk_v47() {
    sed -i 's/"max_deposit_period": "[^"]*"/"max_deposit_period": "30s"/' $CHAIN_DIR/config/genesis.json
    # sed -i 's/"amount": "[^"]*"/"amount": "10"/' $CHAIN_DIR/config/genesis.json
    sed -i 's/"voting_period": "[^"]*"/"voting_period": "30s"/' $CHAIN_DIR/config/genesis.json
    sed -i 's/"quorum": "[^"]*"/"quorum": "0.000000000000000000"/' $CHAIN_DIR/config/genesis.json
    sed -i 's/"threshold": "[^"]*"/"threshold": "0.000000000000000000"/' $CHAIN_DIR/config/genesis.json
    sed -i 's/"veto_threshold": "[^"]*"/"veto_threshold": "0.000000000000000000"/' $CHAIN_DIR/config/genesis.json
}

# Check for gov params structure using grep instead of jq
if grep -q '"gov":{"params"' $CHAIN_DIR/config/genesis.json; then
    gov_overrides_sdk_v47
else
    gov_overrides_sdk_v46
fi

$CHAIN_BIN tendermint show-node-id

# ensure that the client.toml file exists
# this attempt causes the chain to panic
# ixod config keyring-backend test --home /ixo/.ixod
# manually creating it
echo 'chain-id = ""' > /ixo/.ixod/config/client.toml


ls $CHAIN_DIR
ls $CHAIN_DIR/config

echo "END OF CUSTOM UPDATE-GENESIS SCRIPT"
