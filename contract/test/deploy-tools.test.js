// @ts-check

/* eslint-disable import/order -- https://github.com/endojs/endo/issues/1235 */
import { test } from './prepare-test-env-ava.js';

import * as agoricGovernance from '@agoric/governance';
import * as charter from '@agoric/inter-protocol/src/econCommitteeCharter.js';
import { DisplayInfoShape } from '@agoric/ertp/src/typeGuards.js';
import * as agoricERTP from '@agoric/ertp';
import { mustMatch, keyEQ } from '@endo/patterns';
import { makeMarshal } from '@endo/marshal';
import {
  ParamTypes,
  CONTRACT_ELECTORATE,
  INVITATION_MAKERS_DESC,
} from '../src/platform-goals/start-governed-contract.js';
import { marshalData } from '../src/platform-goals/board-aux.core.js';
import { AmountMath } from '../src/platform-goals/start-contract.js';

test('local copy of ParamTypes matches @agoric/governance', async t => {
  t.deepEqual(ParamTypes, agoricGovernance.ParamTypes);
});

test('local copy of ELECTORATE matches @agoric/governance', async t => {
  t.deepEqual(CONTRACT_ELECTORATE, agoricGovernance.CONTRACT_ELECTORATE);
});

test('local copy of INVITATION_MAKERS_DESC matches @agoric/iner-protocol', async t => {
  t.deepEqual(INVITATION_MAKERS_DESC, charter.INVITATION_MAKERS_DESC);
});

test('boardAux marshal short-cut matches @endo/marshal', async t => {
  const displayInfo = harden({
    assetKind: 'nat',
    decimalPlaces: 6,
  });
  mustMatch(displayInfo, DisplayInfoShape);
  const m0 = makeMarshal(undefined, undefined, {
    serializeBodyFormat: 'smallcaps',
  });
  const actual = marshalData.toCapData(displayInfo);
  const expected = m0.toCapData(displayInfo);
  t.deepEqual(actual, expected);
  t.true(keyEQ(actual, expected));
});

test('AmountMath.make work-alike matches @agoric/ertp', async t => {
  const kit1 = agoricERTP.makeIssuerKit('KW1');
  const actual = AmountMath.make(kit1.brand, 123n);
  const expected = agoricERTP.AmountMath.make(kit1.brand, 123n);
  t.deepEqual(actual, expected);
  t.true(keyEQ(actual, expected));
});
