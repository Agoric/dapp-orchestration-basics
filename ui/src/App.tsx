import { ContractProvider } from './providers/Contract';
import { AgoricProvider } from '@agoric/react-components';
import { Navbar } from './components/Navbar';
import { Tabs } from './components/Tabs';
import { wallets } from 'cosmos-kit';
import '@agoric/react-components/dist/style.css';

function App() {
  return (
    <AgoricProvider
      // @ts-expect-error XXX typedef _chainWalletMap is protected
      wallets={wallets.extension}
      defaultNetworkConfig={{
        testChain: {
          chainId: 'agoriclocal',
          chainName: 'agoric-local',
        },
        apis: {
          rest: ['http://localhost:1317'],
          rpc: ['http://localhost:26657'],
        },
      }}
    >
      <ContractProvider>
        <Navbar />
        <Tabs />
      </ContractProvider>
    </AgoricProvider>
  );
}

export default App;
