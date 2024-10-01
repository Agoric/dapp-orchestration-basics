import { AgoricWalletConnection, useAgoric } from '@agoric/react-components';
import { StargateClient } from '@cosmjs/stargate';
import { useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'react-daisyui';
import { NotificationContext } from '../../context/NotificationContext';
import { useContractStore } from '../../store/contract';
import { DynamicToastChild } from '../Tabs';
import { rpcEndpoints, getIbcChannel } from '../../util';

const fetchBalances = async (addresses, agoricChainName) => {
  return Promise.all(
    addresses.map(async address => {
      console.log('address', address);
      let chain = '';
      if (address.startsWith('osmo1')) {
        chain = 'osmosis';
      } else if (address.startsWith('agoric1')) {
        chain = 'agoric';
      } else {
        return {
          address,
          balances: [],
        };
      }

      const rpcEndpoint = rpcEndpoints[agoricChainName][chain];
      try {
        const balance = await fetchBalanceFromRpc(address, rpcEndpoint);
        return {
          address,
          balances: balance,
        };
      } catch (e) {
        console.log('e:', e);
        return {
          address,
          balances: [],
        };
      }
    }),
  );
};

const fetchBalanceFromRpc = async (address, rpcEndpoint) => {
  const client = await StargateClient.connect(rpcEndpoint);
  const balances = await client.getAllBalances(address);
  return balances.map(coin => ({
    denom: coin.denom,
    amount: coin.amount,
  }));
};

const makeAccountOffer = async (
  wallet: AgoricWalletConnection,
  addNotification: (arg0: DynamicToastChild) => void,
  selectedChain: string,
) => {
  if (!selectedChain) {
    addNotification({
      text: `Please Select Chain`,
      status: 'error',
    });
    return;
  }
  const { instances } = useContractStore.getState();
  // const instance = instances?.['basicFlows'];
  const instance = instances?.['orca'];

  if (!instance) throw Error('no contract instance');

  const want = {};
  const give = {};

  // const makeAccountofferId = `makeAccount-${Date.now()}`;
  const makeAccountofferId = Date.now();

  // Make the initial offer
  wallet?.makeOffer(
    {
      source: 'contract',
      instance,
      // publicInvitationMaker: 'makeOrchAccountInvitation',
      publicInvitationMaker: 'makeAccountInvitation',
      // source: 'agoricContract',
      // instancePath: ['basicFlows'],
      // callPipe: [['makeOrchAccountInvitation']],
    },
    { give, want },
    { chainName: selectedChain },
    // {},
    (update: { status: string; data?: unknown }) => {
      if (update.status === 'error') {
        console.log(update);
      }
      if (update.status === 'accepted') {
        console.log(update);
      }
      if (update.status === 'refunded') {
        console.log(update);
      }
    },
    makeAccountofferId,
  );
};

// TODO: this can be for making an account

const MakeAccount = () => {
  const { walletConnection, chainName: agoricChainName } = useAgoric();
  const { addNotification } = useContext(NotificationContext);

  const icas = useContractStore(state => state.icas);
  console.log('ica from inside makeaccount', icas);

  const [balances, setBalances] = useState([]);
  const [selectedChain, setSelectedChain] = useState('');

  //spinners

  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [loadingStake, setLoadingStake] = useState(false);
  const [loadingUnstake, setLoadingUnstake] = useState(false);
  const [loadingCreateAccount, setLoadingCreateAccount] = useState(false);

  //modal
  // const [modalOpen, modalSetOpen] = useState(false);
  // const handleToggle = () => modalSetOpen((prev) => !prev);
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const handleToggle = () => {
    if (modalRef.current) {
      if (modalOpen) {
        modalRef.current.close();
      } else {
        modalRef.current.showModal();
      }
      setModalOpen(!modalOpen);
    }
  };

  useEffect(() => {
    const loadBalances = async () => {
      try {
        const fetchedBalances = await fetchBalances(icas, agoricChainName);
        console.log('fetchedBalances');
        console.log(fetchedBalances);
        setBalances(fetchedBalances);
      } catch (error) {
        console.error('Failed to fetch balances:', error);
      }
    };

    // if (icas && icas.length > 0 && selectedChain) {
    if (icas && icas.length > 0) {
      loadBalances();
    }
  }, [agoricChainName, icas, selectedChain]);

  // //spinners
  useEffect(() => {
    document
      .querySelectorAll('.loading-spinner')
      .forEach((spinner: HTMLElement) => {
        spinner.style.display = 'inline-block';
      });
  }, []);

  //modal

  const handleCreateAccount = () => {
    setLoadingCreateAccount(true);
    if (walletConnection) {
      makeAccountOffer(walletConnection, addNotification!, selectedChain);
      setLoadingCreateAccount(false);
    } else {
      addNotification!({
        text: 'error: please connect your wallet or check your connection to RPC endpoints',
        status: 'error',
      });
      setLoadingCreateAccount(false);
    }
  };

  const handleDeposit = async address => {
    setLoadingDeposit(true);
    try {
      let chain = '';
      if (address.startsWith('osmo1')) {
        chain = 'osmosis';
      } else if (address.startsWith('agoric1')) {
        chain = 'agoric';
      } else {
        throw new Error('unsupported address prefix');
      }
      const { signingClient, address: walletAddress } = walletConnection;

      if (chain === 'agoric') {
        const sendMsg = {
          typeUrl: '/cosmos.bank.v1beta1.MsgSend',
          value: {
            fromAddress: walletAddress,
            toAddress: address,
            amount: [{ denom: 'ubld', amount: '1000000' }],
          },
        };

        const fee = {
          amount: [{ denom: 'ubld', amount: '5000' }],
          gas: '200000',
        };

        const result = await signingClient.signAndBroadcast(
          walletAddress,
          [sendMsg],
          fee,
          '',
        );
        console.log(result);
        if (result.code !== undefined && result.code !== 0) {
          throw new Error(`failed to send message: ${result}`);
        }
        console.log('message sent successfully');
      } else {
        const sourceChannel = await getIbcChannel(agoricChainName, chain);
        const sendMsg = {
          typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
          value: {
            sourcePort: 'transfer',
            sourceChannel,
            token: { denom: 'uosmo', amount: '1000000' },
            sender: walletAddress,
            receiver: address,
            timeoutTimestamp: (Math.floor(Date.now() / 1000) + 600) * 1e9, // 10
          },
        };

        const fee = {
          amount: [{ denom: 'ubld', amount: '5000' }],
          gas: '200000',
        };

        const result = await signingClient.signAndBroadcast(
          walletAddress,
          [sendMsg],
          fee,
          '',
        );
        console.log(result);
        if (result.code !== undefined && result.code !== 0) {
          throw new Error(`Failed to send IBC transfer: ${result}`);
        }
        console.log('ibc transfer sent successfully');
      }
    } catch (error) {
      console.error('failed to deposit:', error);
    } finally {
      setLoadingDeposit(false);
    }
  };

  const handleWithdraw = () => {
    setLoadingWithdraw(true);
    // setLoadingWithdraw(false);
  };

  const handleStake = () => {
    setLoadingStake(true);
    // setLoadingStake(false);
  };

  const handleUnstake = () => {
    setLoadingUnstake(true);
    // setLoadingUnstake(false);
  };

  const guidelines = true;

  return (
    <div className="flex w-full flex-col items-center">
      <div className="w-full p-4">
        <div
          className={`flex flex-row items-start justify-between space-x-10 border${guidelines ? '' : '-0'}`}
        >
          <div
            className={`flex w-2/3 flex-col space-y-10 rounded-lg p-4 pr-4 border${guidelines ? '' : '-0'}`}
          >
            <h1 className="daisyui-card-title">Accounts</h1>
            {balances.map((balance, idx) => (
              <div
                key={idx}
                className={`card bg-base-100 rounded-lg p-4 shadow-md border${guidelines ? '' : '-0'}`}
              >
                {' '}
                {/* card */}
                <p>
                  Address: {balance.address.slice(0, 10)}...
                  {balance.address.slice(-10)}
                </p>
                {balance.balances.map((bal, idx) => (
                  <p key={idx}>
                    {bal.denom}: {bal.amount}
                  </p>
                ))}
                <div
                  className={`mt-2 flex flex-col space-y-1 border${guidelines ? '' : '-0'}`}
                >
                  <div
                    className="inline-flex rounded-md shadow-sm"
                    role="group"
                  >
                    <button
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white ${loadingDeposit ? 'bg-gray-600' : 'bg-gray-800'} rounded-l-lg border border-gray-700 hover:bg-gray-700 hover:text-blue-500 focus:z-10 focus:text-blue-500 focus:ring-2 focus:ring-blue-500`}
                      onClick={() => handleDeposit(balance.address)}
                      disabled={loadingDeposit}
                    >
                      {loadingDeposit ? (
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="me-3 inline h-4 w-4 animate-spin text-gray-200 dark:text-gray-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="#1C64F2"
                          />
                        </svg>
                      ) : (
                        'Deposit'
                      )}
                    </button>

                    <button
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white ${loadingWithdraw ? 'bg-gray-600' : 'bg-gray-800'} border-b border-t border-gray-700 hover:bg-gray-700 hover:text-blue-500 focus:z-10 focus:text-blue-500 focus:ring-2 focus:ring-blue-500`}
                      onClick={handleWithdraw}
                      disabled={loadingWithdraw}
                    >
                      {loadingWithdraw ? (
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="me-3 inline h-4 w-4 animate-spin text-gray-200 dark:text-gray-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="#1C64F2"
                          />
                        </svg>
                      ) : (
                        'Withdraw'
                      )}
                    </button>

                    <button
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white ${loadingStake ? 'bg-gray-600' : 'bg-gray-800'} border-b border-t border-gray-700 hover:bg-gray-700 hover:text-blue-500 focus:z-10 focus:text-blue-500 focus:ring-2 focus:ring-blue-500`}
                      onClick={handleStake}
                      disabled={loadingStake}
                    >
                      {loadingStake ? (
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="me-3 inline h-4 w-4 animate-spin text-gray-200 dark:text-gray-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="#1C64F2"
                          />
                        </svg>
                      ) : (
                        'Stake'
                      )}
                    </button>

                    <button
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white ${loadingUnstake ? 'bg-gray-600' : 'bg-gray-800'} rounded-r-lg border border-gray-700 hover:bg-gray-700 hover:text-blue-500 focus:z-10 focus:text-blue-500 focus:ring-2 focus:ring-blue-500`}
                      onClick={handleUnstake}
                      disabled={loadingUnstake}
                    >
                      {loadingUnstake ? (
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="me-3 inline h-4 w-4 animate-spin text-gray-200 dark:text-gray-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="#1C64F2"
                          />
                        </svg>
                      ) : (
                        'Unstake'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`flex w-1/2 flex-col space-y-4 rounded-lg p-4 pl-4 border${guidelines ? '' : '-0'}`}
          >
            <select
              className="select select-bordered mb-4 w-full max-w-xs rounded-lg border-0 text-lg"
              onChange={e => setSelectedChain(e.target.value)}
            >
              <option disabled selected>
                Select Remote Chain
              </option>
              <option value="osmosis">Osmosis</option>
              <option value="agoric">Agoric</option>
            </select>

            <button
              className={`daisyui-btn daisyui-btn-info mt-4 w-full self-center text-sm ${loadingCreateAccount ? 'bg-gray-600' : 'bg-blue-500'}`}
              onClick={handleCreateAccount}
              disabled={loadingCreateAccount}
            >
              {loadingCreateAccount ? (
                <svg
                  aria-hidden="true"
                  role="status"
                  className="me-3 inline h-4 w-4 animate-spin text-gray-200 dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="#1C64F2"
                  />
                </svg>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* modal work */}
      <dialog ref={modalRef} className="daisyui-modal">
        <div className="daisyui-modal-box w-8/12 max-w-5xl">
          <h3 className="text-lg font-bold">Hello!</h3>
          <p className="py-4">Click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <Button onClick={handleToggle}>Open Modal</Button>
    </div>
  );
};

export { MakeAccount };
