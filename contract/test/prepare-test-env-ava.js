/**
 * Like prepare-test-env but also sets up ses-ava and provides
 * the ses-ava `test` function to be used as if it is the ava
 * `test` function.
 */

import '@endo/init/pre-bundle-source.js';
import '@agoric/zoe/tools/prepare-test-env.js';
import rawTest from 'ava';
import { wrapTest } from '@endo/ses-ava';

export const test = wrapTest(rawTest);
