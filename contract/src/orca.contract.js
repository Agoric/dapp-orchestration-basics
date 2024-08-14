/* eslint-disable -- FIXME */
import { M } from '@endo/patterns';

import { makeTracer, StorageNodeShape } from '@agoric/internal';
import { makeDurableZone } from '@agoric/zone/durable.js';

/// <reference types="@agoric/zoe/src/contractFacet/types-ambient" />

const trace = makeTracer('OrchDev1');

/**
 * @import { Baggage } from '@agoric/vat-data';
 * @import { IBCConnectionID } from '@agoric/vats';
 * @import { TimerService } from '@agoric/time';
 */

export const meta = harden({
  privateArgsShape: {
    orchestration: M.remotable('orchestration'),
    storageNode: StorageNodeShape,
    marshaller: M.remotable('Marshaller'),
    timer: M.remotable('TimerService'),
  },
});

export const privateArgsShape = meta.privateArgsShape;

export const terms = harden({});

/**
 *
 * @param {ZCF<{}>} zcf
 * @param {{
 * }} privateArgs
 * @param {Baggage} baggage
 */
export const start = async (zcf, privateArgs, baggage) => {
  trace('===== CONTRACT STARTING :) ======');
  const zone = makeDurableZone(baggage);

  const publicFacet = zone.exo(
    'Orca Public Facet',
    M.interface('StakeAtomI', {
      makeAccount: M.callWhen().returns(M.remotable('ChainAccount')),
      makeAcountInvitationMaker: M.call().returns(M.promise()),
    }),
    {},
  );

  return harden({ publicFacet });
};

harden(start);
