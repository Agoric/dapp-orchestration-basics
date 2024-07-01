export const stringifyData = (d: unknown) =>
  JSON.stringify(d, (_, v) => (typeof v === 'bigint' ? v.toString() : v), 2);
