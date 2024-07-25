import { PropsWithChildren, useEffect } from 'react';
import {
  type ChainStorageWatcher,
  AgoricChainStoragePathKind as Kind,
} from '@agoric/rpc';
import { useAgoric } from '@agoric/react-components';
import { useContractStore } from '../store/contract';

const { fromEntries } = Object;

const watchContract = (watcher: ChainStorageWatcher) => {
  watcher.watchLatest<Array<[string, unknown]>>(
    [Kind.Data, 'published.agoricNames.instance'],
    instances => {
      console.log('Got instances', instances);
      useContractStore.setState({
        instances: fromEntries(instances),
      });
    },
  );

  watcher.watchLatest<Array<[string, unknown]>>(
    [Kind.Data, 'published.agoricNames.brand'],
    brands => {
      console.log('Got brands', brands);
      useContractStore.setState({
        brands: fromEntries(brands),
      });
    },
  );

  watcher.watchLatest<Array<string>>(
    [Kind.Children, 'published.orca'],
    icas => {
      console.log('Got ICAs', icas);
      useContractStore.setState({
        icas: icas,
      });
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
