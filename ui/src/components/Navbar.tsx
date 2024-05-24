import { ConnectWalletButton } from '@agoric/react-components';
import { NetworkDropdown } from '@agoric/react-components';
import { ThemeProvider, useTheme } from '@interchain-ui/react';

const localnet = {
  testChain: {
    chainId: 'agoriclocal',
    chainName: 'agoric-local',
  },
  apis: {
    rest: ['http://localhost:1317'],
    rpc: ['http://localhost:26657'],
    iconUrl: '/agoriclocal.svg', // Optional icon for dropdown display
  },
};

const Navbar = () => {
  const { themeClass } = useTheme();

  return (
    <div className="daisyui-navbar bg-neutral text-neutral-content">
      {/* Agoric logo */}
      <div className="flex-none">
        <button className="daisyui-btn daisyui-btn-square daisyui-btn-ghost">
          <img src="/agoric.svg" />
        </button>
      </div>
      {/* dApp title */}
      <div className="flex-1">
        <button className="daisyui-btn daisyui-btn-ghost text-xl">
          dApp Agoric Dao
        </button>
      </div>
      {/* network selector */}
      <ThemeProvider>
        <div className={themeClass}>
          <div>
            <NetworkDropdown networkConfigs={[localnet]} />
          </div>
        </div>
      </ThemeProvider>
      {/* connect wallet button */}
      <div className="flex-none">
        <ConnectWalletButton className="daisyui-btn daisyui-btn-outline daisyui-btn-secondary" />
      </div>
    </div>
  );
};

export { Navbar };
