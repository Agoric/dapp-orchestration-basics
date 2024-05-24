import { PropsWithChildren, useEffect, useState } from 'react';
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
        instance: instances
          .find(([name]) => name === 'simpleDAO')!
          .at(1),
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

    watcher.watchLatest<Array<[unknown]>>(
    [Kind.Data, 'published.dao-proposals.proposal'],
    proposals => {
      if ((proposals != undefined) && (String(proposals) != "")){
        useContractStore.setState({
          proposals: proposals,
        });
      }else{
        useContractStore.setState({
          proposals: [],
        });
      }
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
