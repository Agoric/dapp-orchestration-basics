import { makeRetryUntilCondition } from '../tools/sleep.js';
import { makeDeployBuilder } from '../tools/deploy.js';
import { makeContainer } from '../tools/agd-lib.js';
import { promisify } from 'node:util';
import { makeE2ETools } from '../tools/e2e-tools.js';

/**
 * @import {Agd} from '../tools/agd-lib.js';
 */
const { entries, fromEntries } = Object;

export const chainConfig = {
  cosmoshub: { expectedAddressPrefix: 'cosmos' },
  osmosis: { expectedAddressPrefix: 'osmo' },
  agoric: { expectedAddressPrefix: 'agoric' },
};

export const chainAccounts = {
  agoric: {
    address: 'agoric1v8qxguqqjtfyfwqr8ln2wlu858vkx4860jzf6g',
    mnemonic:
      'swift element zoo argue predict ugly awful alert glance net tourist body',
  },
  cosmoshub: {
    address: 'agoric17th0tvrzmwc2fqpeneuwmrwcm8armyjlgmypuf',
    mnemonic:
      'joke lecture black sniff goddess grain then forum level achieve pen alone',
  },
  osmosis: {
    address: 'agoric17hglh4q5k087nthneq0kegk4y838vmt3vk80u3',
    mnemonic:
      'burden noise endorse upon waste sibling slot can banner equip chalk small',
  },
};

/**
 * @param {Agd['keys']} keyring
 * @param {{[name: string]: { mnemonic: string, address: string }}} [accounts]
 */
export const ensureAccounts = async (keyring, accounts = chainAccounts) => {
  for (const [name, detail] of entries(accounts)) {
    let actual = '?';
    try {
      actual = await keyring.showAddress(name);
    } catch (lookupErr) {
      // XXX ambient console
      console.debug('TODO: if "not found", suppress; else re-throw', lookupErr);
      actual = 'ERR';
    }
    if (actual === detail.address) {
      console.debug(name, ': key already in keyring');
      continue;
    }
    if (actual !== 'ERR') {
      console.debug(name, ': delete');
      await keyring.delete(name);
    }
    await keyring.add(name, detail.mnemonic);
    console.debug(name, ': added', detail.address);
  }
  const nameToAddr = harden(
    fromEntries(entries(accounts).map(([p, v]) => [p, v.address])),
  );
  return nameToAddr;
};

export const commonSetup = (
  t,
  { execFile, container, bundleCache, readFile, fetch, setTimeout, log },
) => {
  const tools = makeE2ETools(log, bundleCache, {
    execFileSync: container.execFileSync,
    copyFiles: container.copyFiles,
    fetch,
    setTimeout,
  });

  /** @param {string} path */
  const readJSON = path => readFile(path, 'utf-8').then(x => JSON.parse(x));
  const execFileP = promisify(execFile);
  /**
   * @param {string} file
   * @param {string[]} args
   */
  const npx = (file, args) => execFileP('npx', ['--no-install', file, ...args]);
  const deployBuilder = makeDeployBuilder(tools, readJSON, npx);

  const retryUntilCondition = makeRetryUntilCondition({
    log: t.log,
    setTimeout,
  });

  return { ...tools, retryUntilCondition, deployBuilder };
};
