import { PropsWithChildren, useEffect, useState } from 'react';
import {
  type ChainStorageWatcher,
  AgoricChainStoragePathKind as Kind,
} from '@agoric/rpc';
import { useAgoric } from '@agoric/react-components';
import { useContractStore } from '../store/contract';

// const { fromEntries } = Object;
const watchContract = (watcher: ChainStorageWatcher) => {
  console.log(watcher)
  console.log(Kind)
  watcher.watchLatest<Array<[string, unknown]>>(
    [Kind.Data, 'published.agoricNames.instance'],
    instances => {
      console.log('Got instances', instances);
      // useContractStore.setState({
      //   instance: instances
      //     .find(([name]) => name === 'orca')!
      //     .at(1),
      // });
    },
  );

};

export const ContractProvider = ({ children }: PropsWithChildren) => {
  const { chainStorageWatcher } = useAgoric();
  useEffect(() => {
    if (chainStorageWatcher) {
      watchContract(chainStorageWatcher);
    }
  }, [chainStorageWatcher]);

  return <>{children}</>;
};
