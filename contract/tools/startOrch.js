// @ts-check

import { Far } from '@endo/far';
import { makeTracer } from '../src/tools/debug.js';

const trace = makeTracer('startOrch');

/** @param {BootstrapPowers} powers */
export const startOrchCoreEval = async ({
  produce: { orchestration, localchain },
}) => {
  trace('startOrchCoreEval');
  orchestration.resolve(Far('DummyOrchestration'));
  localchain.resolve(Far('DummyLocalchain'));
  trace('startOrchCoreEval done');
};
