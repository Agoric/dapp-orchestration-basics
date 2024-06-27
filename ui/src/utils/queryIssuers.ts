import {
  type ChainStorageWatcher,
  AgoricChainStoragePathKind,
} from '@agoric/rpc';

export const queryIssuers = async (
  chainStorageWatcher: ChainStorageWatcher,
) => {
  const issuers = await chainStorageWatcher.queryOnce([
    AgoricChainStoragePathKind.Data,
    'published.agoricNames.issuer',
  ]);

  // @ts-expect-error cast
  return new Map(issuers);
};
