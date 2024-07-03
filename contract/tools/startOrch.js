// @ts-check

import { Far } from '@endo/far';

/** @param {BootstrapPowers} powers */
export const startOrchCoreEval = async ({ produce: { orchestration } }) => {
  orchestration.resolve(Far('DummyOrchestration'));
};
