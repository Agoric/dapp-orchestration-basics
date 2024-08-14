// @ts-check

import { Far } from '@endo/far';
import { makeTracer } from '../src/tools/debug.js';

const trace = makeTracer('startOrch');

/** @param {BootstrapPowers} powers */
export const startOrchCoreEval = async ({
  produce: {
    cosmosInterchainService,
    localchain,
    chainTimerService,
    chainStorage,
    agoricNames,
  },
}) => {
  trace('startOrchCoreEval');
  cosmosInterchainService.resolve(Far('DummyOrchestration'));
  localchain.resolve(Far('DummyLocalchain'));
  chainTimerService.resolve(Far('DummyTimer'));
  chainStorage.resolve(Far('DummyStorageNode'));
  agoricNames.resolve(Far('agoricNames'));
  trace('startOrchCoreEval done');
};
