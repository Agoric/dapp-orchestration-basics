/**
 * @file rollup configuration to bundle core-eval script
 *
 * Supports developing core-eval script, permit as a module:
 *   - import { E } from '@endo/far'
 *     We can strip this declaration during bundling
 *     since the core-eval scope includes exports of @endo/far
 *   - `bundleID = ...` is replaced using updated/cached bundle hash
 *   - `main` export is appended as script completion value
 *   - `permit` export is emitted as JSON
 */
// @ts-check
import process from 'node:process';
import {
  coreEvalGlobals,
  moduleToScript,
  configureBundleID,
  emitPermit,
  configureOptions,
} from './tools/rollup-plugin-core-eval.js';

// import { permit as daoPermit } from './src/privacy-coin.proposal.js';
import { permit as orcaPermit } from './src/orca.proposal.js';

import { permit as boardAuxPermit } from './src/platform-goals/board-aux.core.js';

// symlinks
// import { nodeResolve } from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
// import json from '@rollup/plugin-json';
// import replace from '@rollup/plugin-replace';
// import typescript from '@rollup/plugin-typescript';

/**
 * @param {*} opts
 * @returns {import('rollup').RollupOptions}
 */
const config1 = ({
  name,
  coreEntry = `./src/${name}.proposal.js`,
  contractEntry = `./src/${name}.contract.js`,
  coreScript = `bundles/deploy-${name}.js`,
  coreScriptOptions = undefined,
  permitFile = `deploy-${name}-permit.json`,
  permit,
}) => ({
  input: coreEntry,
  output: {
    globals: coreEvalGlobals,
    file: coreScript,
    format: 'es',
    footer: 'main',
  },
  external: ['@endo/far'],
  plugins: [
    ...(contractEntry
      ? [
          configureBundleID({
            name,
            rootModule: contractEntry,
            cache: 'bundles',
          }),
        ]
      : []),
    // ...(coreScriptOptions
    //   ? [configureOptions({ options: coreScriptOptions })]
    //   : []),
    moduleToScript(),
    emitPermit({ permit, file: permitFile }),
    // nodeResolve({
    //   preferBuiltins: true,
    //   mainFields: ['module', 'main'],
    //   // moduleDirectories: ['node_modules'],
    //   moduleDirectories: ['node_modules'],
    //   // modulePaths: ['../../agoric-sdk/packages'],
    //   dedupe: ['@agoric/vow', '@agoric/orchestration', '@agoric/vats'],
    // }),
    // commonjs(),
    // json(),
    // replace({
    //   'process.env.NODE_ENV': JSON.stringify('production'),
    //   preventAssignment: true,
    // }),
    // typescript({
    //   tsconfig: './tsconfig.json',  // Ensure you have a tsconfig.json file in your project root
    // }),
  ],
});

const { env } = process;

/** @type {import('rollup').RollupOptions[]} */
const config = [
  // config1({
  //   name: 'board-aux',
  //   permit: boardAuxPermit,
  //   coreEntry: `./src/platform-goals/board-aux.core.js`,
  //   contractEntry: null,
  // }),
  config1({
    name: 'orca',
    permit: orcaPermit,
  }),
];
export default config;
