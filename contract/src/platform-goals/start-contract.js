/** @file utilities to start typical contracts in core eval scripts. */
// @ts-check

import { E } from '@endo/far';

/**
 * @import {AssetKind, Brand, Issuer, Purse} from '@agoric/ertp/src/types.js';
 */

const { Fail } = assert;

/**
 * Given a bundleID and a permitted name, install a bundle and "produce"
 * the installation, which also publishes it via agoricNames.
 *
 * @param {BootstrapPowers} powers - zoe, installation.produce[name]
 * @param {{ name: string, bundleID: string }} opts
 */
export const installContract = async (
  { consume: { zoe }, installation: { produce: produceInstallation } },
  { name, bundleID },
) => {
  const installation = await E(zoe).installBundleID(bundleID);
  produceInstallation[name].reset();
  produceInstallation[name].resolve(installation);
  console.log(name, '(re-)installed as', bundleID.slice(0, 8));
  return installation;
};

/**
 * Given a permitted name, start a contract instance; save upgrade info; publish instance.
 * Optionally: publish issuers/brands.
 *
 * Note: publishing brands requires brandAuxPublisher from board-aux.core.js.
 *
 * @param {BootstrapPowers} powers - consume.startUpgradable, installation.consume[name], instance.produce[name]
 * @param {{
 *   name: string;
 *   startArgs?: StartArgs;
 *   issuerNames?: string[];
 * }} opts
 *
 * @typedef {Partial<Parameters<Awaited<BootstrapPowers['consume']['startUpgradable']>>[0]>} StartArgs
 */
export const startContract = async (
  powers,
  { name, startArgs, issuerNames },
) => {
  console.log('POWERS');
  console.log(powers);
  const {
    consume: { startUpgradable },
    installation: { consume: consumeInstallation },
    instance: { produce: produceInstance },
  } = powers;

  const installation = await consumeInstallation[name];

  console.log(name, 'start args:', startArgs);

  const started = await E(startUpgradable)({
    ...startArgs,
    installation,
    label: name,
  });

  const { instance } = started;
  produceInstance[name].reset();
  produceInstance[name].resolve(instance);

  console.log(name, 'started');

  if (issuerNames) {
    /** @type {BootstrapPowers & import('./board-aux.core.js').BoardAuxPowers} */
    // @ts-expect-error cast
    const auxPowers = powers;

    const { zoe, brandAuxPublisher } = auxPowers.consume;
    const { produce: produceIssuer } = auxPowers.issuer;
    const { produce: produceBrand } = auxPowers.brand;
    const { brands, issuers } = await E(zoe).getTerms(instance);

    await Promise.all(
      issuerNames.map(async issuerName => {
        const brand = brands[issuerName];
        const issuer = issuers[issuerName];
        console.log('CoreEval script: share via agoricNames:', brand);

        produceBrand[issuerName].reset();
        produceIssuer[issuerName].reset();
        produceBrand[issuerName].resolve(brand);
        produceIssuer[issuerName].resolve(issuer);

        await E(brandAuxPublisher).publishBrandInfo(brand);
      }),
    );
  }

  return started;
};

/**
 * In order to avoid linking from other packages, we
 * provide a work-alike for AmountMath.make and use tests to check equivalence.
 *
 * Note that this version doesn't do as much input validation.
 */
export const AmountMath = {
  /**
   * @template {AssetKind} K
   * @param {Brand<K>} brand
   * @param {*} value
   */
  make: (brand, value) => harden({ brand, value }),
};

const pathSegmentPattern = /^[a-zA-Z0-9_-]{1,100}$/;

/** @type {(name: string) => void} */
export const assertPathSegment = name => {
  pathSegmentPattern.test(name) ||
    Fail`Path segment names must consist of 1 to 100 characters limited to ASCII alphanumerics, underscores, and/or dashes: ${name}`;
};
harden(assertPathSegment);

/** @type {(name: string) => string} */
export const sanitizePathSegment = name => {
  const candidate = name.replace(/[ ,]/g, '_');
  assertPathSegment(candidate);
  return candidate;
};
