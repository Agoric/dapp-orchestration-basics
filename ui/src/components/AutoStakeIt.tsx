import React, { useEffect, useState } from 'react';
import {
  makeAgoricChainStorageWatcher,
  AgoricChainStoragePathKind as Kind,
} from '@agoric/rpc';
import { create } from 'zustand';
import {
  makeAgoricWalletConnection
} from '@agoric/web-components';
import { Toaster, toast } from 'react-hot-toast';

const ENDPOINTS = {
  RPC: 'http://localhost:26657',
  API: 'http://localhost:1317',
};

const watcher = makeAgoricChainStorageWatcher(ENDPOINTS.API, 'agoriclocal');

interface AppState {
  wallet?: any;
  autoStakeContractInstance?: unknown;
  brands?: Record<string, unknown>;
}

const useAppStore = create<AppState>(() => ({}));

const setup = async () => {
  watcher.watchLatest<Array<[string, unknown]>>(
    [Kind.Data, 'published.agoricNames.instance'],
    instances => {
      useAppStore.setState({
        autoStakeContractInstance: instances
          .find(([name]) => name === 'autoStakeIt')!
          .at(1),
      });
    },
  );
  const wallet = await makeAgoricWalletConnection(watcher, ENDPOINTS.RPC);
  useAppStore.setState({ wallet });

  watcher.watchLatest<Array<[string, unknown]>>(
    [Kind.Data, 'published.agoricNames.brand'],
    brands => {
      useAppStore.setState({
        brands: Object.fromEntries(brands),
      });
    },
  );
};

const AutoStakeIt: React.FC = () => {
  const [chainName, setChainName] = useState('cosmoshub');
  const [chainId, setChainId] = useState('cosmoshub-4');
  const [validatorValue, setValidatorValue] = useState('cosmosvaloper1test');
  const [validatorEncoding, setValidatorEncoding] = useState('bech32');

  useEffect(() => {
    setup();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const { wallet, autoStakeContractInstance } = useAppStore.getState();
    if (!autoStakeContractInstance) {
      toast.error('No instance of Smart Contract found on chain!', {
        duration: 10000,
        position: 'bottom-right',
      });
      return;
    }

    const data = {
      chainName,
      validator: {
        chainId,
        value: validatorValue,
        encoding: validatorEncoding,
      },
    };

    wallet?.makeOffer(
      {
        source: 'contract',
        instance: autoStakeContractInstance,
        publicInvitationMaker: 'makeAccountsInvitation',
        fee: {
          gas: '400000',
          amount: [
            {
              amount: '0',
              denom: 'uist',
            },
          ],
        },
      },
      {}, // No assets being exchanged
      {
        stakeData: data,
      },
      (update: { status: string; data?: unknown }) => {
        if (update.status === 'error') {
          toast.error(`Error: ${update.data}`, {
            duration: 10000,
            position: 'bottom-right',
          });
        }
        if (update.status === 'accepted') {
          toast.success('Stake submitted successfully', {
            duration: 10000,
            position: 'bottom-right',
          });
        }
        if (update.status === 'refunded') {
          toast.error('Stake submission rejected', {
            duration: 10000,
            position: 'bottom-right',
          });
        }
      },
    );
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Auto Stake It</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="chainName">Chain Name</label>
          <input
            type="text"
            id="chainName"
            required
            value={chainName}
            onChange={e => setChainName(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="chainId">Chain ID</label>
          <input
            type="text"
            id="chainId"
            required
            value={chainId}
            onChange={e => setChainId(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="validatorValue">Validator Value</label>
          <input
            type="text"
            id="validatorValue"
            required
            value={validatorValue}
            onChange={e => setValidatorValue(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="validatorEncoding">Validator Encoding</label>
          <input
            type="text"
            id="validatorEncoding"
            required
            value={validatorEncoding}
            onChange={e => setValidatorEncoding(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '8px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '12px' }}>
          Submit
        </button>
      </form>
      <Toaster />
    </div>
  );
};

export default AutoStakeIt;
