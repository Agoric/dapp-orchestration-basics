import { test } from './prepare-test-env-ava.js';
import { MsgCreateThought } from '../../protos/dist/cyber/dmn/v1beta1/tx.js';

test('custom proto', t => {
  const msg = MsgCreateThought.toProtoMsg({
    name: 'test',
    particle: 'test',
    program: 'test',
    trigger: {
      block: 1n,
      period: 1n,
    },
    load: {
      gasPrice: {
        denom: 'ubld',
        amount: '1',
      },
      input: 'test',
    },
  });

  t.like(msg, {
    typeUrl: '/cyber.dmn.v1beta1.MsgCreateThought',
  });
  t.true(msg.value instanceof Uint8Array);
});
