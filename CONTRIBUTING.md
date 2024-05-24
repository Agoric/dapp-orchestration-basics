## Testing the contract (WIP)

```sh
cd contract
yarn  # may take a while
yarn test
```

```
yarn test
yarn run v1.22.21
$ ava --verbose

start proposal module evaluating
bundles/ add: assetContract from /Users/luqi/github/Agoric/dapp-agoric-basics/contract/src/agoric-basics.contract.js
  ✔ bundle-source › bundleSource() bundles the contract for use with zoe (960ms)
    ℹ 1ec13424eb2a4e76ed175ae38e42a85bd5d54d0d21c28bbfb54805f1188f7ac3276cc1a525d1cc78fbdbfa430802355ba910d10c4e3b9f0cd8f88a500a0e1db0
    ℹ Object @Alleged: BundleInstallation {}
bundles/ bundled 155 files in bundle-assetContract.js at 2024-02-07T19:45:55.154Z
startAgoricBasicsContract()...
  ✔ contract › Install the contract
    ℹ Object @Alleged: BundleInstallation {}
agoric: run: running /Users/luqi/github/Agoric/dapp-agoric-basics/contract/scripts/build-contract-deployer.js
start proposal module evaluating
/Users/luqi/github/Agoric/dapp-agoric-basics/contract/bundles add: agoric-basics from /Users/luqi/github/Agoric/dapp-agoric-basics/contract/src/agoric-basics.contract.js
/Users/luqi/github/Agoric/dapp-agoric-basics/contract/bundles bundled 155 files in bundle-agoric-basics.js at 2024-02-07T19:45:55.537Z
  ✔ build-proposal › proposal builder generates compressed bundles less than 1MB (2.2s)
    ℹ agoric run stdout: agoric: run: Deploy script will run with Node.js ESM
      bundle-source --to /Users/luqi/github/Agoric/dapp-agoric-basics/contract/bundles /Users/luqi/github/Agoric/dapp-agoric-basics/contract/src/agoric-basics.contract.js agoric-basics
      creating start-agoric-basics-permit.json
      creating start-agoric-basics.js
      You can now run a governance submission command like:
        agd tx gov submit-proposal swingset-core-eval start-agoric-basics-permit.json start-agoric-basics.js \
          --title="Enable <something>" --description="Evaluate start-agoric-basics.js" --deposit=1000000ubld \
          --gas=auto --gas-adjustment=1.2
      Remember to install bundles before submitting the proposal:
        agd tx swingset install-bundle @/Users/luqi/.agoric/cache/b1-1ec13424eb2a4e76ed175ae38e42a85bd5d54d0d21c28bbfb54805f1188f7ac3276cc1a525d1cc78fbdbfa430802355ba910d10c4e3b9f0cd8f88a500a0e1db0.json
        agd tx swingset install-bundle @/Users/luqi/.agoric/cache/b1-404e6c68f4ca70f434e7e06e537027ca57539746f093ec3c46900451e65b7896807a8e94c36a0b719ad1b4cc24c5cae8ace02bb3df9e12470d26c8decfbdb168.json


    ℹ {
        bundleId: 'b1-1ec13424eb2a4e76ed175ae38e42a85bd5d54d0d21c28bbfb54805f1188f7ac3276cc1a525d1cc78fbdbfa430802355ba910d10c4e3b9f0cd8f88a500a0e1db0',
        compressedSize: '0.31427860260009766 MB',
      }
    ℹ {
        bundleId: 'b1-404e6c68f4ca70f434e7e06e537027ca57539746f093ec3c46900451e65b7896807a8e94c36a0b719ad1b4cc24c5cae8ace02bb3df9e12470d26c8decfbdb168',
        compressedSize: '0.15766525268554688 MB',
      }
  ✔ contract › Start the contract (910ms)
    ℹ terms: {
        tradePrice: {
          brand: Object @Alleged: PlayMoney brand {},
          value: 5n,
        },
      }
    ℹ Object @Alleged: InstanceHandle {}
CoreEval script: started contract Object [Alleged: InstanceHandle] {}
  ✔ contract › Alice trades: give some play money, want items (930ms)
    ℹ Object @Alleged: InstanceHandle {}
    ℹ Alice gives {
        Price: {
          brand: Object @Alleged: PlayMoney brand {},
          value: 5n,
        },
      }
    ℹ Alice payout brand Object @Alleged: Item brand {}
    ℹ Alice payout value Object @copyBag {
        payload: [
          [
            'scroll',
            1n,
          ],
          [
            'map',
            1n,
          ],
        ],
      }
CoreEval script: share via agoricNames: Object [Alleged: Item brand] {}
agoricBasics (re)started
bundles/ add: centralSupply from /Users/luqi/github/Agoric/dapp-agoric-basics/node_modules/@agoric/vats/src/centralSupply.js
bundles/ bundled 119 files in bundle-centralSupply.js at 2024-02-07T19:45:56.736Z
  ✔ contract › Trade in IST rather than play money (1.9s)
    ℹ Alice gives {
        Price: {
          brand: Object @Alleged: ZDEFAULT brand {},
          value: 250000n,
        },
      }
    ℹ Alice payout brand Object @Alleged: Item brand {}
    ℹ Alice payout value Object @copyBag {
        payload: [
          [
            'scroll',
            1n,
          ],
          [
            'map',
            1n,
          ],
        ],
      }
  ✔ contract › use the code that will go on chain to start the contract (1.9s)
    ℹ Alice gives {
        Price: {
          brand: Object @Alleged: ZDEFAULT brand {},
          value: 250000n,
        },
      }
    ℹ Alice payout brand Object @Alleged: Item brand {}
    ℹ Alice payout value Object @copyBag {
        payload: [
          [
            'scroll',
            1n,
          ],
          [
            'map',
            1n,
          ],
        ],
      }
  ─

  7 tests passed
✨  Done in 3.94s.
```

Any `Error#1: changed ...` diagnostics are benign reports of updated files
outdating the contract bundle. It's benign: the test will re-build the bundle
as necessary.
