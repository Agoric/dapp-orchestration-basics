import test from 'ava';
import { makeAgd, makeContainer } from '../tools/agd-lib.js';

const mockIO = t => {
  const execLog = [];
  const cookie = 'oothaiW3'; // from pwgen; unlikely to occur elsewhere
  /** @type {import('../tools/agd-lib.js').ExecSync} */
  const execFileSync = (file, args, opts) => {
    execLog.push({ file, args, opts });
    return JSON.stringify({ output: cookie });
  };

  const logLog = [];
  const log = (...args) => {
    t.log(...args);
    logLog.push(args);
  };

  return { execFileSync, execLog, log, logLog, cookie };
};

test('makeAgd handles key lookup', async t => {
  const io = mockIO(t);
  const { execFileSync, log } = io;

  const agd = makeAgd({ execFileSync });
  const data = await agd.lookup('gov1');
  t.deepEqual(data, JSON.stringify({ output: io.cookie }));
  const subCmd = 'keys show --address gov1';
  t.is(io.execLog[0].args.join(' '), subCmd);
  t.like(io.execLog, [{ file: 'agd', opts: { encoding: 'utf-8' } }]);
});

test('container virtualizes agd status command', async t => {
  const io = mockIO(t);
  const { execFileSync, log } = io;

  const c1 = makeContainer({ execFileSync, log }).withFlags({ tty: false });

  const actual = c1.execFileSync('agd', ['status'], { encoding: 'utf-8' });
  t.deepEqual(actual, JSON.stringify({ output: io.cookie }));
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

  t.deepEqual(data, JSON.stringify({ output: io.cookie }));
  const subCmd =
    'exec -i agoriclocal-genesis-0 --container validator --tty false -- agd keys show --address gov1 --keyring-backend test';
  t.is(io.execLog[0].args.join(' '), subCmd);

  t.like(io.execLog, [{ file: 'kubectl', opts: { encoding: 'utf-8' } }]);
});

test('container copies files', async t => {
  const io = mockIO(t);
  const { execFileSync, log } = io;
  const c1 = makeContainer({ execFileSync, log }).withFlags({ tty: false });

  const x = c1.copyFiles(['contract.deploy.js', 'contract-permit.json']);

  const hCmd = [
    'exec',
    '-i',
    'agoriclocal-genesis-0',
    '--container',
    'validator',
    '--tty',
    false,
  ];
  t.deepEqual(io.execLog, [
    {
      file: 'kubectl',
      args: [...hCmd, '--', 'mkdir', '-p', '/root'],
      opts: { encoding: 'utf-8' },
    },
    {
      file: 'kubectl',
      args: [
        'cp',
        'contract.deploy.js',
        'agoriclocal-genesis-0:/root/',
        '--container',
        'validator',
      ],
      opts: { encoding: 'utf-8' },
    },
    {
      file: 'kubectl',
      args: [
        'cp',
        'contract-permit.json',
        'agoriclocal-genesis-0:/root/',
        '--container',
        'validator',
      ],
      opts: { encoding: 'utf-8' },
    },
    {
      file: 'kubectl',
      args: [...hCmd, '--', 'ls', '/root'],
      opts: { encoding: 'utf-8' },
    },
  ]);
});
