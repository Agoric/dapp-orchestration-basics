#!/bin/bash
set -xueo pipefail

# cd /workspace/contract

SCRIPT=start-orca.js
# SCRIPT=/root/src/platform-goals/start-contract.js
# SCRIPT=/root/scripts/start-contract-v2.js

PERMIT=start-orca-permit.json
ls -sh "$SCRIPT" "$PERMIT"

PROPOSAL=$(agd query gov proposals --output json | jq -c '.proposals | length | .+1')
echo $PROPOSAL

make fund-acct

agd tx gov submit-proposal swingset-core-eval "$PERMIT" "$SCRIPT" \
  --title="Start Orca Contract" --description="Evaluate $SCRIPT" \
  --deposit=10000000ubld --gas=auto --gas-adjustment=1.2 \
  --from alice --chain-id agoriclocal --keyring-backend=test \
  --yes -b block

# set +x # not so noisy for this part
# . /usr/src/upgrade-test-scripts/env_setup.sh
# voteLatestProposalAndWait