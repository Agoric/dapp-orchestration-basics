import { ContractProvider } from './providers/Contract';
import { AgoricProvider } from '@agoric/react-components';
import { Navbar } from './components/Navbar';
import { Tabs } from './components/Tabs';
import { wallets } from 'cosmos-kit';
import { ThemeProvider, useTheme } from '@interchain-ui/react';
import '@agoric/react-components/dist/style.css';
import { useEffect } from 'react';
// import { Button, Modal } from 'react-daisyui';

function App() {
  const { themeClass, setTheme, setColorMode } = useTheme();
  useEffect(() => {
    setColorMode('dark');
    setTheme('dark');
  }, [setTheme, setColorMode]);

  return (
    <ThemeProvider>
      <div className={themeClass}>
        <AgoricProvider
          // @ts-expect-error XXX _chainWalletMap' is protected but type 'MainWalletBase' is not a class derived from 'MainWalletBase
          wallets={wallets.extension}
          agoricNetworkConfigs={[
            {
              testChain: {
                chainId: 'agoriclocal',
                chainName: 'agoric-local',
                iconUrl: 'agoric.svg', // Optional icon for dropdown display
              },
              apis: {
                rest: ['http://localhost:1317'],
                rpc: ['http://localhost:26657'],
              },
            },
            {
              testChain: {
                chainId: 'agoric-emerynet-8',
                chainName: 'emerynet',
                iconUrl: 'agoric.svg',
              },
              apis: {
                rest: ['https://emerynet.api.agoric.net'],
                rpc: ['https://emerynet.rpc.agoric.net'],
              },
            },
          ]}
          defaultChainName="agoric-local"
        >
          <ContractProvider>
            <Navbar />
            <Tabs />
          </ContractProvider>
        </AgoricProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
