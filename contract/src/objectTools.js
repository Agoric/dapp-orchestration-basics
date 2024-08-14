// @ts-check
import { E } from '@endo/far';

/** @import {ERef} from '@endo/far'; */

const { entries, fromEntries } = Object;

/**
 * Given a record whose values may be promise, return a promise for a record with all the values resolved.
 *
 * @type { <T extends Record<string, ERef<any>>>(obj: T) => Promise<{ [K in keyof T]: Awaited<T[K]>}> }
 */
export const allValues = async obj => {
  const es = await Promise.all(
    entries(obj).map(([k, vp]) => E.when(vp, v => [k, v])),
  );
  return fromEntries(es);
};

/**
 * Map a function over the values of a record.
 *
 * @type { <V, U, T extends Record<string, V>>(obj: T, f: (v: V) => U) => { [K in keyof T]: U }}
 */
export const mapValues = (obj, f) =>
  fromEntries(
    entries(obj).map(([p, v]) => {
      const entry = [p, f(v)];
      return entry;
    }),
  );

/**
 * Given 2 arrays that form columns of a table, return an array of the rows.
 *
 * @type {<X, Y>(xs: X[], ys: Y[]) => [X, Y][]}
 */
export const zip = (xs, ys) => xs.map((x, i) => [x, ys[i]]);

/**
 * Dynamic check for non-nullish
 *
 * @template T
 * @param {T | null | undefined } x
 * @returns {T}
 */
export const NonNullish = x => {
  if (x === undefined || x === null) throw assert.error('NonNullish');
  return x;
};
