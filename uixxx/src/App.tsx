import { ContractProvider } from './providers/Contract';
import { AgoricProvider } from '@agoric/react-components';
// import { Navbar } from './components/Navbar';
// import { Tabs } from './components/Tabs';
import { wallets } from 'cosmos-kit';
// import { ThemeProvider, useTheme } from '@interchain-ui/react';
import '@agoric/react-components/dist/style.css';



function App() {
  // console.log("ds")
  return (
    <AgoricProvider
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
        {/* <Navbar />
        <Tabs /> */}
      </ContractProvider>
    </AgoricProvider>
  );
}

export default App;
