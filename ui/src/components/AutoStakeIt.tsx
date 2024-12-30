import React, { useEffect, useState } from 'react';
import { makeAgoricChainStorageWatcher, AgoricChainStoragePathKind as Kind } from '@agoric/rpc';
import { create } from 'zustand';
import { makeAgoricWalletConnection } from '@agoric/web-components';
import { Toaster } from 'react-hot-toast';

const ENDPOINTS = {
  RPC: 'http://localhost:26657',
  API: 'http://localhost:1317',
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '2rem',
  },
  card: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#e8eaec',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '0.5rem',
  },
  description: {
    color: '#64748b',
    fontSize: '1.0rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  label: {
    fontWeight: '500',
    color: '#334155',
    fontSize: '1.0rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    fontSize: '1.0rem',
    transition: 'all 0.2s',
    outline: 'none',
    backgroundColor: '#334155',
    color: 'white',
  },
  button: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '6px',
    border: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonHover: {
    backgroundColor: '#1d4ed8',
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
    cursor: 'not-allowed',
  },
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
    (instances) => {
      useAppStore.setState({
        autoStakeContractInstance: instances.find(([name]) => name === 'autoStakeIt')?.[1],
      });
    },
  );
  const wallet = await makeAgoricWalletConnection(watcher, ENDPOINTS.RPC);
  useAppStore.setState({ wallet });

  watcher.watchLatest<Array<[string, unknown]>>(
    [Kind.Data, 'published.agoricNames.brand'],
    (brands) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setup();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const { wallet, autoStakeContractInstance } = useAppStore.getState();
    if (!autoStakeContractInstance) {
      toast.error('No instance of Smart Contract found on chain!');
      setIsLoading(false);
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
          amount: [{ amount: '0', denom: 'uist' }],
        },
      },
      {}, 
      { stakeData: data },
      (update: { status: string; data?: unknown }) => {
        setIsLoading(false);
        if (update.status === 'error') {
          toast.error(`Error: ${update.data}`);
        }
        if (update.status === 'accepted') {
          toast.success('Stake submitted successfully');
        }
        if (update.status === 'refunded') {
          toast.error('Stake submission rejected');
        }
      },
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Auto Stake It</h2>
          <p style={styles.description}>Configure your automatic staking parameters</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={styles.formGroup}>
              <label htmlFor="chainName" style={styles.label}>
                Chain Name
              </label>
              <select
                id="chainName"
                required
                value={chainName}
                onChange={(e) => setChainName(e.target.value)}
                style={styles.input}
              >
                <option value="cosmoshub">cosmoshub</option>
                <option value="agoric">agoric</option>
                <option value="osmosis">osmosis</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="chainId" style={styles.label}>
                Chain ID
              </label>
              <input
                type="text"
                id="chainId"
                required
                value={chainId}
                onChange={(e) => setChainId(e.target.value)}
                style={{ ...styles.input, width: '188%' }}
                placeholder="Enter chain ID"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="validatorValue" style={styles.label}>
              Validator Value
            </label>
            <input
              type="text"
              id="validatorValue"
              required
              value={validatorValue}
              onChange={(e) => setValidatorValue(e.target.value)}
              style={styles.input}
              placeholder="Enter validator value"
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="validatorEncoding" style={styles.label}>
              Validator Encoding
            </label>
            <select
              id="validatorEncoding"
              required
              value={validatorEncoding}
              onChange={(e) => setValidatorEncoding(e.target.value)}
              style={styles.input}
            >
              <option value="bech32">bech32</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              ...(isHovered && !isLoading ? styles.buttonHover : {}),
              ...(isLoading ? styles.buttonDisabled : {}),
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isLoading ? 'Processing...' : 'Auto Stake It'}
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default AutoStakeIt;
