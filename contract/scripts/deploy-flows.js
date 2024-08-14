#!/usr/bin/env node
/* global process, fetch, setTimeout */
// @ts-check
import '@endo/init/debug.js';
import { createRequire } from 'module';
import { execa } from 'execa';
import fse from 'fs-extra';
import { execFile, execFileSync } from 'node:child_process';

import { makeNodeBundleCache } from '@endo/bundle-source/cache.js';
import { parseArgs } from 'node:util';
import { makeE2ETools } from '../src/flows/tools/e2e-tools.js';

const nodeRequire = createRequire(import.meta.url);
const { readJSON } = fse;

/** @type {import('node:util').ParseArgsConfig['options']} */
const options = {
  help: { type: 'boolean' },
  builder: { type: 'string' },
  service: { type: 'string', default: 'agd' },
  workdir: { type: 'string', default: '/workspace/contract' },
};
/**
 * @typedef {{
 *   help: boolean,
 *   builder: string, 
 *   service: string,
 *   workdir: string,
 * }} DeployOptions
 */

const Usage = `
deploy-contract [options] [--install <contract>] [--eval <proposal>]...

Options:
  --help               print usage
  --builder            proposal builder
  --service SVC        docker compose service to run agd (default: ${options.service.default}).
                       Use . to run agd outside docker.
  --workdir DIR        workdir for docker service (default: ${options.workdir.default})
`;

const main = async (bundleDir = 'bundles') => {
  const { argv } = process;
  // const { writeFile } = fsp;

  const progress = (...args) => console.warn(...args); // stderr

  const bundleCache = await makeNodeBundleCache(bundleDir, {}, s => import(s));

  /** @type {{ values: DeployOptions }} */
  // @ts-expect-error options config ensures type
  const { values: flags } = parseArgs({ args: argv.slice(2), options });
  if (flags.help) {
    progress(Usage);
    return;
  }

  const { builder } = flags;

  const tools = await makeE2ETools(console.log, bundleCache, {
    execFileSync,
    execFile,
    fetch,
    setTimeout,
  });

  console.log(`building plan: ${builder}`);
  // build the plan
  const { stdout } = await execa`agoric run ${builder}`;
  console.log({ stdout })
  const match = stdout.match(/ (?<name>[-\w]+)-permit.json/);
  if (!(match && match.groups)) {
    throw new Error('no permit found');
  }
  const plan = await readJSON(`./${match.groups.name}-plan.json`);
  console.log(plan);

  console.log('copying files to container');
  tools.copyFiles([
    nodeRequire.resolve(`../${plan.script}`),
    nodeRequire.resolve(`../${plan.permit}`),
    ...plan.bundles.map(b => b.fileName),
  ]);

  console.log('installing bundles');
  await tools.installBundles(
    plan.bundles.map(
      b => `/tmp/contracts/${b.bundleID}.json`,
    ),
    console.log,
  );

  console.log('executing proposal');
  await tools.runCoreEval({
    name: plan.name,
    description: `${plan.name} proposal`,
  });
};

main().catch(err => console.log(err));
