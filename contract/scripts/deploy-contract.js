#!/usr/bin/env node
/* global process, fetch, setTimeout */
// @ts-check
import '@endo/init';
import fsp from 'node:fs/promises';
import { execFile, execFileSync, execSync } from 'node:child_process';
import { basename } from 'node:path';
import { execa } from 'execa';
import fse from 'fs-extra';

import { makeNodeBundleCache } from '@endo/bundle-source/cache.js';
import { parseArgs } from 'node:util';
import { makeE2ETools } from '../tools/e2e-tools.js';
import { createRequire } from 'module';

const nodeRequire = createRequire(import.meta.url);
const { readJSON } = fse;


/** @type {import('node:util').ParseArgsConfig['options']} */
/**
 * @typedef {{
 *   help: boolean,
 *   install?: string,
 *   eval?: string[],
 *   service: string,
 *   workdir: string,
 * }} DeployOptions
 */

/** @type {import('node:util').ParseArgsConfig['options']} */
const options = {
  help: { type: 'boolean' },
  builder: { type: 'string' },
  service: { type: 'string', default: 'agd' },
  workdir: { type: 'string', default: '/workspace/contract' },
  install: { type: 'string' },
  eval: { type: 'string', multiple: true },
};
/**
 * @typedef {{
 *   help: boolean,
 *   builder: string, 
 *   service: string,
 *   workdir: string,
 *   install: string,
 * }} DeployOptions
 */

const Usage = `
deploy-contract [options] [--install <contract>] [--eval <proposal>]...

Options:
  --help               print usage
  --install            entry module of contract to install
  --eval               entry module of core evals to run
                       (cf rollup.config.mjs)
  --service SVC        docker compose service to run agd (default: ${options.service.default}).
                       Use . to run agd outside docker.
  --workdir DIR        workdir for docker service (default: ${options.workdir.default})
`;

const mockExecutionContext = () => {
  const withSkip = o =>
    Object.assign(o, {
      skip: (..._xs) => {},
    });
  return {
    log: withSkip((...args) => console.log(...args)),
    is: withSkip((actual, expected, message) =>
      assert.equal(actual, expected, message),
    ),
  };
};

const main = async (bundleDir = 'bundles') => {
  const { argv } = process;
  const { writeFile } = fsp;

  const progress = (...args) => console.warn(...args); // stderr

  const bundleCache = await makeNodeBundleCache(bundleDir, {}, s => import(s));

  /** @type {{ values: DeployOptions }} */
  // @ts-expect-error options config ensures type
  const { values: flags } = parseArgs({ args: argv.slice(2), options });
  if (flags.help) {
    progress(Usage);
    return;
  }
  /** @type {{ _workdir: string, service: string }} */
  const { service } = flags;

  /** @type {import('../tools/agd-lib.js').ExecSync} */

  const dockerExec = (
    file,
    dargs,
    opts = { encoding: 'utf-8', maxBuffer: 1024 * 1024 * 2000 },
  ) => {
    console.log('docker exec try 1: ', file);
    opts.verbose && console.log('exec', JSON.stringify([file, ...dargs]));
    console.log('docker exec try 2');

    const command = `${file} ${dargs.join(' ')}`;
    console.log('command: ', command);
    console.log(service);

    return execSync(command, opts);
  };

  const t = mockExecutionContext();
  const tools = await makeE2ETools(t, bundleCache, {
    execFile,
    execFileSync: service === '.' ? execFileSync : dockerExec,
    fetch,
    setTimeout,
    writeFile,
    bundleDir,
  });

  const stem = path => basename(path).replace(/\..*/, '');

  if (flags.install) {
    const name = stem(flags.install);
    console.log('installing bundle from deploy-contract.js ....');
    await tools.installBundles([ flags.install ], progress);
  }

  if (flags.eval) {
    for await (const entryFile of flags.eval) {
      const result = await tools.runCoreEval({
        name: stem(entryFile),
        entryFile,
      });
      progress(result);
    }
  }
};

main().catch(err => console.error(err));
