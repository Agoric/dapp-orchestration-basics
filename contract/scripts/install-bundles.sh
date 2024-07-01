#!/bin/bash
# NOTE: intended to run _inside_ the agd container

set -xueo pipefail

# function to install a bundle
install_bundle() {
  ls -sh "$1"
  agd status
  agd keys list
  echo "about to install: @$1"

  # get the current sequence number for the account
  sequence=$(agd q auth account $(agd keys show alice -a --keyring-backend=test) --output json | jq -r .sequence)
  echo "current sequence: $sequence"

  # try the current sequence first
  bundle_path="@$1"
  echo "bundle_path: $bundle_path"
  
  if ! agd tx swingset install-bundle "$bundle_path" \
    --from alice --keyring-backend=test --gas=auto --gas-adjustment=1.2 --yes --sequence=$sequence -o json -b block; then
    echo "current sequence failed, trying incremented sequence"
    sequence=$((sequence + 1))
    echo "incremented sequence: $sequence"
    agd tx swingset install-bundle "$bundle_path" \
      --from alice --keyring-backend=test --gas=auto --gas-adjustment=1.2 --yes --sequence=$sequence -o json -b block

  fi
  # --from alice --keyring-backend=test --gas=auto --gas-adjustment=1.2 --chain-id=agoriclocal -b block --yes --sequence=$expected_sequence -o json

}

# check if bundle-list-ship file exists and is not empty
# if [ ! -s bundles/bundle-list-ship ]; then
if [ ! -s bundles/bundle-list]; then
  echo "No bundles to install."
  exit 1
fi

make balance-q  # check if we have enough IST

# read each bundle file path from bundle-list-ship and install it
while IFS= read -r BUNDLE_FILE; do 
  echo "installing $BUNDLE_FILE"
  install_bundle "$BUNDLE_FILE"
# done < bundles/bundle-list-ship
done < bundles/bundle-list