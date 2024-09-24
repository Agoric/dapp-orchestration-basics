import { test } from './prepare-test-env-ava.js';
import { makeAgd, makeContainer } from '../tools/agd-lib.js';
import { makeE2ETools } from '../tools/e2e-tools.js';
import { makeDeployBuilder } from '../tools/deploy.js';
import { makeNodeBundleCache } from '@endo/bundle-source/cache.js';
import { commonSetup, ensureAccounts } from './support.js';

const contractName = 'myContract';
const chainInfoBuilder = 'proposals/revise-chain-info.builder.js';
const contractBuilder = './test/builder/init-orca.js';
const myPlan = {
  name: 'myContract',
  script: 'myContract.deploy.js',
  permit: 'myContract-permit.json',
  bundles: [{ fileName: '/home/me/.agoric/cache/b1-DEADBEEF.json' }],
};

const mockIO = t => {
  const execLog = [];
  const cookie = 'oothaiW3'; // from pwgen; unlikely to occur elsewhere

  let latest_block_height = 100;
  const files = new Set();

  const { stringify } = JSON;

  const readJSON = async path => {
    t.is(path, `./${myPlan.permit.replace('-permit', '-plan')}`);
    return myPlan;
  };

  /** @type {import('../tools/agd-lib.js').ExecSync} */
  const execFileSync = (file, args, opts) => {
    execLog.push({ file, args, opts });
    if (args.includes('status')) {
      return stringify({ SyncInfo: { latest_block_height } });
    }
    if (args.includes('keys') && args.includes('show')) {
      return 'agoric1234';
    }
    let proposal_id = 0;
    if (args.includes('gov') && args.includes('proposals')) {
      proposal_id += 1;
      return stringify({ proposals: [{ proposal_id }] });
    }
    if (args.includes('gov') && args.includes('proposal')) {
      proposal_id += 1;
      return stringify({ status: 'PROPOSAL_STATUS_PASSED' });
    }
    if (args.includes('tx')) {
      return stringify({ code: 0, txhash: 'abc123', height: 123 });
    }
    if (args[0] === 'cp') {
      files.add(args[1]);
      return '';
    }
    if (args.includes('ls')) {
      return [...files].sort().join(' ');
    }
    if (args.includes('agoric') && args.includes('run')) {
      return `... ${myPlan.permit}`;
    }
    return stringify({ output: cookie });
  };
  /**
   * @param {string} file
   * @param {string[]} args
   */
  const execFile = (file, args, cb) => {
    try {
      const stdout = execFileSync(file, args, { encoding: 'utf-8' });
      cb(null, { stdout });
    } catch (err) {
      cb(err);
    }
  };

  const npx = (file, args) => {
    t.log('npx', file, ...args);
    return Promise.resolve(
      execFileSync(file, args, { encoding: 'utf-8' }),
    ).then(_stdout => ({ stdout: ` ${myPlan.permit}` }));
  };

  const logLog = [];
  const log = (...args) => {
    t.log(...args);
    logLog.push(args);
  };

  /** @type {typeof fetch} */
  // @ts-expect-error mock
  const fetch = async (url, settings) => ({
    ok: true,
    text: async () => 'TEXT',
    json: async () => {
      if (url.endsWith('agoricNames.instance')) {
        // XXX incomplete vstorage encoding
        // relies on lax parsing in batchQuery.js
        return { value: stringify({ value: [[contractName, null]] }) };
      }
      if (settings.method !== 'POST') throw Error('todo');
      const body = JSON.parse(settings.body);
      if ('jsonrpc' in body) {
        const { jsonrpc, id } = body;
        if (body.method !== 'status') throw Error('todo');
        latest_block_height += 1;
        return { jsonrpc, id, result: { sync_info: { latest_block_height } } };
      }
      throw Error('todo');
    },
  });

  /** @type { typeof setTimeout } */
  // @ts-expect-error mock
  const setTimeout = (cb, ms) => Promise.resolve().then(_ => cb());
  return {
    execFile,
    execFileSync,
    execLog,
    readJSON,
    npx,
    readFile: (...args) => readJSON(...args).then(x => stringify(x)),
    log,
    logLog,
    cookie,
    fetch,
    setTimeout,
  };
};

test('makeAgd handles key lookup', async t => {
  const io = mockIO(t);
  const { execFileSync, log } = io;

  const agd = makeAgd({ execFileSync });
  const data = await agd.lookup('gov1');
  t.deepEqual(data, 'agoric1234');
  const subCmd = 'keys show --address gov1';
  t.is(io.execLog[0].args.join(' '), subCmd);
  t.like(io.execLog, [{ file: 'agd', opts: { encoding: 'utf-8' } }]);
});

test('agd tx swingset install-bundle', async t => {
  const io = mockIO(t);
  const { execFileSync } = io;
  const agd = makeAgd({ execFileSync }); // TODO: pass log explicitly

  const data = await agd.tx(['swingset', 'install-bundle', '@f1'], {
    from: 'acct1',
    chainId: 'c1',
  });
  t.deepEqual(data, {
    code: 0,
    height: 123,
    txhash: 'abc123',
  });
});

test('container virtualizes agd status command', async t => {
  const io = mockIO(t);
  const { execFileSync, log } = io;

  const c1 = makeContainer({ execFileSync, log }).withFlags({ tty: false });

  const actual = c1.execFileSync('agd', ['status'], { encoding: 'utf-8' });
  t.deepEqual(
    actual,
    JSON.stringify({ SyncInfo: { latest_block_height: 100 } }),
  );
  t.log(io.execLog[0].args.join(' '));

  const subCmd =
    'exec -i agoriclocal-genesis-0 --container validator --tty false -- agd status';
  t.is(io.execLog[0].args.join(' '), subCmd);
  t.like(io.execLog, [{ file: 'kubectl', opts: { encoding: 'utf-8' } }]);
  t.deepEqual(io.logLog, [
    ['agoriclocal-genesis-0/validator$', 'agd', 'status'],
  ]);
});

test('agd in container', async t => {
  const io = mockIO(t);
  const { execFileSync, log } = io;

  const c1 = makeContainer({ execFileSync, log }).withFlags({ tty: false });
  const agd = makeAgd({ execFileSync: c1.execFileSync }).withOpts({
    keyringBackend: 'test',
  });
  const data = await agd.lookup('gov1');

  t.deepEqual(data, 'agoric1234');
  const subCmd =
    'exec -i agoriclocal-genesis-0 --container validator --tty false -- agd keys show --address gov1 --keyring-backend test';
  t.is(io.execLog[0].args.join(' '), subCmd);

  t.like(io.execLog, [{ file: 'kubectl', opts: { encoding: 'utf-8' } }]);
});

test('container copies files', async t => {
  const io = mockIO(t);
  const { execFileSync, log } = io;
  const c1 = makeContainer({ execFileSync, log }).withFlags({ tty: false });

  const dests = c1.copyFiles(['contract.deploy.js', 'contract-permit.json']);
  t.deepEqual(dests, [
    '/root/contract.deploy.js',
    '/root/contract-permit.json',
  ]);

  t.snapshot(io.execLog, 'exec log');
});

test('deploy-cli style usage', async t => {
  const io = mockIO(t);

  const bundleCache = null;
  const { log } = io;
  const c1 = makeContainer({ execFileSync: io.execFileSync, log });

  const tools = makeE2ETools(log, bundleCache, {
    execFileSync: c1.execFileSync,
    copyFiles: c1.copyFiles,
    fetch: io.fetch,
    setTimeout: io.setTimeout,
  });

  const deployBuilder = makeDeployBuilder(tools, io.readJSON, io.npx);
  await deployBuilder(chainInfoBuilder);

  t.snapshot(io.execLog, 'execLog');
});

test('orca-multichain.test style usage', async t => {
  const io = mockIO(t);

  const bundleCache = await makeNodeBundleCache('bundles', {}, s => import(s));
  const container = makeContainer({ execFileSync: io.execFileSync });

  const { deployBuilder, retryUntilCondition, ...tools } = commonSetup(t, {
    bundleCache,
    container,
    execFile: io.execFile,
    fetch: io.fetch,
    log: t.log,
    readFile: io.readFile,
    setTimeout: io.setTimeout,
  });
  const wallets = await ensureAccounts(tools.agd.keys);
  t.deepEqual(wallets, {
    agoric: 'agoric1v8qxguqqjtfyfwqr8ln2wlu858vkx4860jzf6g',
    cosmoshub: 'agoric17th0tvrzmwc2fqpeneuwmrwcm8armyjlgmypuf',
    osmosis: 'agoric17hglh4q5k087nthneq0kegk4y838vmt3vk80u3',
  });

  t.log('bundle and install contract', contractName);
  await deployBuilder(contractBuilder);
  const { vstorageClient } = tools;
  await retryUntilCondition(
    () => vstorageClient.queryData(`published.agoricNames.instance`),
    res => contractName in Object.fromEntries(res),
    `${contractName} instance is available`,
  );

  // consider snapshotting fetch, readFile access too
  t.snapshot(io.execLog, 'execLog');
});
