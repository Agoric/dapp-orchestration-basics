#!/usr/bin/env node
/* global process, fetch, setTimeout */
// @ts-check
import '@endo/init';
import fsp from 'node:fs/promises';
import { execFile, execFileSync } from 'node:child_process';
import { basename } from 'node:path';

import { makeNodeBundleCache } from '@endo/bundle-source/cache.js';
import { parseArgs } from 'node:util';
import { makeE2ETools } from '../tools/e2e-tools.js';
import { makeContainer } from '../tools/agd-lib.js';

/** @type {import('node:util').ParseArgsConfig['options']} */
const options = {
  help: { type: 'boolean' },
  install: { type: 'string' },
  eval: { type: 'string', multiple: true },
  builder: { type: 'string' },
  pod: { type: 'string', default: 'agoriclocal-genesis-0' },
  container: { type: 'string', default: 'validator' },
  service: { type: 'string', default: 'agd' },
  workdir: { type: 'string' },
};
/**
 * @typedef {{
 *   help: boolean,
 *   install?: string,
 *   eval?: string[],
 *   builder?: string,
 *   pod: string,
 *   container: string,
 *   service: string,
 *   workdir?: string,
 * }} DeployOptions
 */

const Usage = `
deploy-contract [options] [--install <contract>] [--eval <proposal>]...

Options:
  --help               print usage
  --install            entry module of contract to install
  --eval               entry module of core evals to run
                       (cf rollup.config.mjs)
  --pod POD            default: ${options.pod.default}
                       Use . for no pod (docker or host).
  --container C        k8s container. default: ${options.container.default}
  --service SVC        docker compose service to run agd (default: ${options.service.default}).
                       Use . to run on the host.
  --workdir DIR        workdir service
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
  /** @type {{ service: string, pod: string } & { [k:string]: unknown }} */
  const { service, pod, workdir } = flags;

  const runtimes = {
    host: { execFileSync },
    k8s: makeContainer({
      container: flags.container,
      pod: flags.pod,
      execFileSync,
      cmd: ['kubectl', 'exec', '-i'],
    }).withFlags({ workdir, tty: false }),
    docker: makeContainer({
      container: service,
      cmd: ['docker', 'compose', 'exec'],
      execFileSync,
    }).withFlags({ workdir }),
  };
  const runtime =
    runtimes[service === '.' ? 'host' : pod === '.' ? 'docker' : 'k8s'];

  const t = mockExecutionContext();
  const tools = await makeE2ETools(t, bundleCache, {
    execFile,
    execFileSync: runtime.execFileSync,
    fetch,
    setTimeout,
    writeFile,
    bundleDir,
  });

  const stem = path => basename(path).replace(/\..*/, '');

  if (flags.install) {
    const name = stem(flags.install);
    console.log('installing bundle from deploy-contract.js ....');
    await tools.installBundlesE2E([flags.install], progress);
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
