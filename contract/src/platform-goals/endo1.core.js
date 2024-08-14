// @ts-check
import * as marshal from '@endo/marshal';
import * as patterns from '@endo/patterns';

/**
 * @import {BootstrapManifestPermit} from '@agoric/vats/src/core/lib-boot.js';
 */

/**
 * @typedef {{
 *   endo1: {
 *     marshal: typeof import('@endo/marshal');
 *     patterns: typeof import('@endo/patterns');
 *   }
 * }} Endo1Modules
 * @typedef {PromiseSpaceOf<Endo1Modules>} Endo1Space
 */

/**
 * Make @endo/marshal, @endo/patterns available to CoreEval scripts.
 *
 * @param {BootstrapPowers & Endo1Space} permittedPowers
 */
export const produceEndoModules = permittedPowers => {
  const { produce } = permittedPowers;
  const endo = { marshal, patterns };
  produce.endo1.resolve(endo);
};

/** @type {BootstrapManifestPermit} */
export const permit = {
  /** @type {Record<keyof Endo1Modules, true>} */
  produce: { endo1: true },
};

export const main = produceEndoModules;
