#!/bin/bash

set -eux

echo "START OF CUSTOM CREATE-GENESIS SCRIPT"

DENOM="${DENOM:=uixo}"
COINS="100000000000000uixo"
STAKE_AMOUNT="10000000000000uixo"
CHAIN_ID="${CHAIN_ID:=ixolocal}"
CHAIN_BIN="${CHAIN_BIN:=ixod}"
CHAIN_DIR="/ixo/.ixod"
KEYS_CONFIG="${KEYS_CONFIG:=configs/keys.json}"
FAUCET_ENABLED="${FAUCET_ENABLED:=true}"
NUM_VALIDATORS="${NUM_VALIDATORS:=1}"
NUM_RELAYERS="${NUM_RELAYERS:=0}"

# check if the binary has genesis subcommand or not, if not, set CHAIN_GENESIS_CMD to empty
# v0.47 and above
CHAIN_GENESIS_CMD=$($CHAIN_BIN 2>&1 | grep -q "genesis-related subcommands" && echo "genesis" || echo "")

# initialize the chain
CHAIN_INIT_ID="$CHAIN_ID"
echo "chain init"
sed -n '/"genesis"/,/}/p' "$KEYS_CONFIG" | grep '"mnemonic"' | tail -n1 | sed 's/.*"mnemonic": *"\([^"]*\)".*/\1/' | $CHAIN_BIN init $CHAIN_ID --chain-id $CHAIN_INIT_ID --recover

# check if the genesis file exists
ls -al $CHAIN_DIR/config

# TODO: add this once the chain id needs to be updated
# sed -i -e "s/$CHAIN_INIT_ID/$CHAIN_ID/g" $CHAIN_DIR/config/genesis.json

# Add genesis keys to the keyring and self delegate initial coins
GENESIS_NAME=$(sed -n '/"genesis"/,/}/p' "$KEYS_CONFIG" | grep '"name"' | head -1 | sed 's/.*"name": *"\([^"]*\)".*/\1/')
echo "Adding key...." $GENESIS_NAME
sed -n '/"genesis"/,/}/p' "$KEYS_CONFIG" | grep '"mnemonic"' | head -1 | sed 's/.*"mnemonic": *"\([^"]*\)".*/\1/' | $CHAIN_BIN keys add $GENESIS_NAME --recover --keyring-backend="test"
$CHAIN_BIN $CHAIN_GENESIS_CMD add-genesis-account $($CHAIN_BIN keys show -a $GENESIS_NAME --keyring-backend="test") $COINS --keyring-backend="test"

# Add faucet key to the keyring and self delegate initial coins
FAUCET_NAME=$(sed -n '/"faucet"/,/}/p' "$KEYS_CONFIG" | grep '"name"' | head -1 | sed 's/.*"name": *"\([^"]*\)".*/\1/')
echo "Adding key...." $FAUCET_NAME
sed -n '/"faucet"/,/}/p' "$KEYS_CONFIG" | grep '"mnemonic"' | head -1 | sed 's/.*"mnemonic": *"\([^"]*\)".*/\1/' | $CHAIN_BIN keys add $FAUCET_NAME --recover --keyring-backend="test"
$CHAIN_BIN $CHAIN_GENESIS_CMD add-genesis-account $($CHAIN_BIN keys show -a $FAUCET_NAME --keyring-backend="test") $COINS --keyring-backend="test"

# Add test keys to the keyring and self delegate initial coins
TEST_NAME=$(sed -n '/"keys"/,/}/p' "$KEYS_CONFIG" | grep '"name"' | head -1 | sed 's/.*"name": *"\([^"]*\)".*/\1/')
echo "Adding key...." $TEST_NAME
sed -n '/"keys"/,/}/p' "$KEYS_CONFIG" | grep '"mnemonic"' | head -1 | sed 's/.*"mnemonic": *"\([^"]*\)".*/\1/' | $CHAIN_BIN keys add $TEST_NAME --recover --keyring-backend="test"
$CHAIN_BIN $CHAIN_GENESIS_CMD add-genesis-account $($CHAIN_BIN keys show -a $TEST_NAME --keyring-backend="test") $COINS --keyring-backend="test"

if [[ $FAUCET_ENABLED == "false" && $NUM_RELAYERS -gt "-1" ]];
then
  ## Add relayers keys and delegate tokens
  for i in $(seq 0 $NUM_RELAYERS);
  do
    # Add relayer key and delegate tokens
    RELAYER_KEY_NAME=$(sed -n '/"relayers"/,/}/p' "$KEYS_CONFIG" | grep '"name"' | sed -n "$((i+1))p" | sed 's/.*"name": *"\([^"]*\)".*/\1/')
    echo "Adding relayer key.... $RELAYER_KEY_NAME"
    sed -n '/"relayers"/,/}/p' "$KEYS_CONFIG" | grep '"mnemonic"' | sed -n "$((i+1))p" | sed 's/.*"mnemonic": *"\([^"]*\)".*/\1/' | $CHAIN_BIN keys add $RELAYER_KEY_NAME --recover --keyring-backend="test"
    $CHAIN_BIN $CHAIN_GENESIS_CMD add-genesis-account $($CHAIN_BIN keys show -a $RELAYER_KEY_NAME --keyring-backend="test") $COINS --keyring-backend="test"
    
    # Add relayer-cli key and delegate tokens
    RELAYER_CLI_KEY_NAME=$(sed -n '/"relayers_cli"/,/}/p' "$KEYS_CONFIG" | grep '"name"' | sed -n "$((i+1))p" | sed 's/.*"name": *"\([^"]*\)".*/\1/')
    echo "Adding relayer-cli key.... $RELAYER_CLI_KEY_NAME"
    sed -n '/"relayers_cli"/,/}/p' "$KEYS_CONFIG" | grep '"mnemonic"' | sed -n "$((i+1))p" | sed 's/.*"mnemonic": *"\([^"]*\)".*/\1/' | $CHAIN_BIN keys add $RELAYER_CLI_KEY_NAME --recover --keyring-backend="test"
    $CHAIN_BIN $CHAIN_GENESIS_CMD add-genesis-account $($CHAIN_BIN keys show -a $RELAYER_CLI_KEY_NAME --keyring-backend="test") $COINS --keyring-backend="test"
  done
fi

## if faucet not enabled then add validator and relayer with index as keys and into gentx
if [[ $FAUCET_ENABLED == "false" && $NUM_VALIDATORS -gt "1" ]];
then
  ## Add validators key and delegate tokens
  for i in $(seq 0 $NUM_VALIDATORS);
  do
    VALIDATOR_NAME=$(sed -n '/"validators"/,/}/p' "$KEYS_CONFIG" | grep '"name"' | head -1 | sed 's/.*"name": *"\([^"]*\)".*/\1/')
    VAL_KEY_NAME="$VALIDATOR_NAME-$i"
    echo "Adding validator key.... $VAL_KEY_NAME"
    sed -n '/"validators"/,/}/p' "$KEYS_CONFIG" | grep '"mnemonic"' | head -1 | sed 's/.*"mnemonic": *"\([^"]*\)".*/\1/' | $CHAIN_BIN keys add $VAL_KEY_NAME --index $i --recover --keyring-backend="test"
    $CHAIN_BIN $CHAIN_GENESIS_CMD add-genesis-account $($CHAIN_BIN keys show -a $VAL_KEY_NAME --keyring-backend="test") $COINS --keyring-backend="test"
  done
fi

echo "Creating gentx..."
COIN=$(echo $COINS | cut -d ',' -f1)
AMT=$(echo ${COIN//[!0-9]/} | sed -e "s/0000$//")
$CHAIN_BIN $CHAIN_GENESIS_CMD gentx $GENESIS_NAME $STAKE_AMOUNT \
    --chain-id=$CHAIN_ID \
    --moniker="genesis" \
    --commission-max-change-rate=0.01 \
    --commission-max-rate=1.0 \
    --commission-rate=0.05 \
    --min-self-delegation=1 \
    --keyring-backend="test"

echo "Validating genesis..."
$CHAIN_BIN validate-genesis

# Show genesis content
echo "Output of gentx"
cat $CHAIN_DIR/config/gentx/*.json

echo "Running collect-gentxs"
$CHAIN_BIN $CHAIN_GENESIS_CMD collect-gentxs

ls $CHAIN_DIR/config

echo "END OF CUSTOM CREATE-GENESIS SCRIPT"