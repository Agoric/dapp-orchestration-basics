import { useAgoric } from '@agoric/react-components';
import { useContext, useEffect, useRef, useState } from 'react';
import { NotificationContext } from '../../context/NotificationContext';
import { useContractStore } from '../../store/contract';
import AccountList from './AccountList';
import ChainSelector from './ChainSelector';
import CreateAccountButton from './CreateAccountButton';
import { fetchBalances } from './FetchBalances';
import { makeOffer } from './MakeOffer';
import { getIbcChannel } from '../../util';

const Orchestration = () => {
  const { walletConnection, chainName: agoricChainName } = useAgoric();
  const { addNotification } = useContext(NotificationContext);
  const icas = useContractStore(state => state.icas);
  const [balances, setBalances] = useState([]);
  const [selectedChain, setSelectedChain] = useState('');
  const [loadingDeposit, setLoadingDeposit] = useState<{
    [key: string]: boolean;
  }>({});
  const [loadingWithdraw, setLoadingWithdraw] = useState<{
    [key: string]: boolean;
  }>({});
  const [loadingStake, setLoadingStake] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [loadingUnstake, setLoadingUnstake] = useState<{
    [key: string]: boolean;
  }>({});
  const [loadingCreateAccount, setLoadingCreateAccount] = useState(false);
  const [loadingCreateAndFund, setLoadingCreateAndFund] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAddress, setModalAddress] = useState('');
  const [selectedDenom, setSelectedDenom] = useState('uist');
  const [amount, setAmount] = useState(0);
  const [statusText, setStatusText] = useState('');
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const guidelines = false;

  const handleToggle = () => {
    setModalOpen(prevState => !prevState);
  };

  useEffect(() => {
    const loadBalances = async () => {
      try {
        const fetchedBalances = await fetchBalances(icas, agoricChainName);
        setBalances(fetchedBalances);
      } catch (error) {
        console.error('failed to fetch balances:', error);
      }
    };
    if (icas && icas.length > 0) {
      loadBalances();
    }
  }, [agoricChainName, icas, selectedChain]);

  const openModal = (content: string, address: string = '') => {
    setModalContent(content);
    setModalAddress(address);
    handleToggle();
  };

  useEffect(() => {
    if (modalRef.current) {
      if (modalOpen) {
        modalRef.current.showModal();
      } else {
        modalRef.current.close();
      }
    }
  }, [modalOpen]);

  const handleCreateAccount = () => {
    setLoadingCreateAccount(true);
    setStatusText('Submitted');
    if (walletConnection) {
      makeOffer(
        walletConnection,
        addNotification!,
        selectedChain,
        'makeAccountInvitation',
        { chainName: selectedChain },
        setLoadingCreateAccount,
        handleToggle,
        setStatusText,
      ).catch(error => {
        addNotification!({
          text: `Transaction failed: ${error.message}`,
          status: 'error',
        });
        setLoadingCreateAccount(false);
        handleToggle();
      });
    } else {
      addNotification!({
        text: 'Error: Please connect your wallet or check your connection to RPC endpoints',
        status: 'error',
      });
      setLoadingCreateAccount(false);
      handleToggle();
      setLoadingCreateAccount(false);
      handleToggle();
    }
  };

  const handleCreateAndFund = () => {
    handleToggle();
    setLoadingCreateAndFund(true);
    setStatusText('Submitted');
    if (walletConnection) {
      openModal('Create & Fund Account...', selectedChain);
      makeOffer(
        walletConnection,
        addNotification!,
        selectedChain,
        'makeCreateAndFundInvitation',
        { chainName: selectedChain, denom: 'ubld' }, // adjust as needed
        setLoadingCreateAndFund,
        handleToggle,
        setStatusText,
      ).catch(error => {
        addNotification!({
          text: `Transaction failed: ${error.message}`,
          status: 'error',
        });
        setLoadingCreateAndFund(false);
        handleToggle();
      });
    } else {
      addNotification!({
        text: 'Error: Please connect your wallet or check your connection to RPC endpoints',
        status: 'error',
      });
      setLoadingCreateAndFund(false);
      handleToggle();
    }
  };

  const handleDeposit = (address: string) => {
    openModal('Deposit', address);
  };

  const executeDeposit = async () => {
    setLoadingDeposit(prevState => ({ ...prevState, [modalAddress]: true }));
    try {
      let chain = '';
      if (modalAddress.startsWith('osmo1')) {
        chain = 'osmosis';
      } else if (modalAddress.startsWith('agoric1')) {
        chain = 'agoric';
      } else {
        throw new Error('unsupported address prefix');
      }
      const { signingClient, address } = walletConnection;
      if (chain === 'agoric') {
        const amountToSend = [
          { denom: selectedDenom, amount: amount.toString() },
        ];
        const fee = {
          amount: [{ denom: 'ubld', amount: '5000' }],
          gas: '200000',
        };
        const result = await signingClient.sendTokens(
          address,
          modalAddress,
          amountToSend,
          fee,
        );
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
            token: { denom: selectedDenom, amount: amount.toString() },
            sender: address,
            receiver: modalAddress,
            timeoutTimestamp: (Math.floor(Date.now() / 1000) + 600) * 1e9, //10
          },
        };
        const fee = {
          amount: [{ denom: 'ubld', amount: '5000' }],
          gas: '200000',
        };
        const result = await walletConnection.signingClient.signAndBroadcast(
          address,
          [sendMsg],
          fee,
          '',
        );
        console.log(result);
        if (result.code !== undefined && result.code !== 0) {
          throw new Error(`Failed to send IBC transfer: ${result}`);
        }
        console.log('IBC transfer sent successfully');
      }
    } catch (error) {
      console.error('failed to deposit:', error);
    } finally {
      setLoadingDeposit(prevState => ({ ...prevState, [modalAddress]: false }));
      handleToggle();
    }
  };

  const handleWithdraw = (address: string) => {
    openModal('Withdraw', address);
    setLoadingWithdraw(prevState => ({ ...prevState, [address]: false }));
  };

  const handleStake = (address: string) => {
    openModal('Stake', address);
    setLoadingStake(prevState => ({ ...prevState, [address]: false }));
  };

  const handleUnstake = (address: string) => {
    openModal('Unstake', address);
    setLoadingUnstake(prevState => ({ ...prevState, [address]: false }));
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="w-full p-4">
        <div
          className={`flex flex-row items-start justify-between space-x-10 border${guidelines ? '' : '-0'}`}
        >
          <AccountList
            balances={balances}
            handleDeposit={handleDeposit}
            handleWithdraw={handleWithdraw}
            handleStake={handleStake}
            handleUnstake={handleUnstake}
            loadingDeposit={loadingDeposit}
            loadingWithdraw={loadingWithdraw}
            loadingStake={loadingStake}
            loadingUnstake={loadingUnstake}
            guidelines={guidelines}
          />

          <div
            className={`flex w-1/2 flex-col space-y-4 rounded-lg p-4 pl-4 border${guidelines ? '' : '-0'}`}
          >
            <ChainSelector setSelectedChain={setSelectedChain} />
            <CreateAccountButton
              handleCreateAccount={handleCreateAccount}
              handleCreateAndFund={handleCreateAndFund}
              loadingCreateAccount={loadingCreateAccount}
              loadingCreateAndFund={loadingCreateAndFund}
            />
          </div>
        </div>
      </div>

      {/* modal */}
      <dialog ref={modalRef} className="daisyui-modal">
        <div className="daisyui-modal-box w-full max-w-md">
          <button
            className="daisyui-btn daisyui-btn-circle daisyui-btn-neutral daisyui-btn-sm absolute right-2 top-2"
            onClick={handleToggle}
          >
            ✕
          </button>
          <h3 className="text-lg font-bold">{modalContent}</h3>
          {modalContent === 'Create Account' && (
            <div className="flex flex-col items-center justify-center py-4">
              <p>{statusText}</p>
              {loadingCreateAccount && (
                <svg
                  aria-hidden="true"
                  role="status"
                  className="me-3 inline h-4 w-4 animate-spin text-gray-200 dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.6C100 78.2 77.6 100.6 50 100.6 22.4 100.6 0 78.2 0 50.6 0 23 22.4 0.6 50 0.6 77.6 0.6 100 23 100 50.6ZM9.1 50.6C9.1 73.2 27.4 91.5 50 91.5 72.6 91.5 90.9 73.2 90.9 50.6 90.9 28 72.6 9.7 50 9.7 27.4 9.7 9.1 28 9.1 50.6Z"
                    fill="currentColor"
                  />
                  <path
                    d="M94 39C96.4 38.4 97.9 35.9 97 33.6 95.3 28.8 92.9 24.4 89.8 20.3 85.8 15.1 80.9 10.7 75.2 7.4 69.5 4.1 63.3 1.9 56.8 1.1 51.8 0.4 46.7 0.4 41.7 1.3 39.3 1.7 37.8 4.2 38.5 6.6 39.1 9 41.6 10.5 44 10.1 47.9 9.5 51.7 9.5 55.5 10 60.9 10.8 66 12.5 70.6 15.3 75.3 18 79.3 21.6 82.6 25.8 84.9 28.9 86.8 32.3 88.2 35.9 89.1 38.2 91.5 39.7 94 39Z"
                    fill="#1C64F2"
                  />
                </svg>
              )}
            </div>
          )}
          {modalContent === 'Deposit' && (
            <div>
              <label className="block">
                <span className="text-gray-700">Select Denom</span>
                <select
                  value={selectedDenom}
                  onChange={e => setSelectedDenom(e.target.value)}
                  className="form-select mt-1 block w-1/2"
                >
                  <option value="ubld">BLD</option>
                  <option value="uist">IST</option>
                  <option value="uosmo">OSMO</option>
                  {/* Add more options as needed */}
                </select>
              </label>
              <label className="mt-4 block">
                <span className="text-gray-700">Amount</span>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(parseInt(e.target.value))}
                  className="form-input mt-1 block w-1/2"
                />
              </label>
              <div className="modal-action mt-4">
                <button
                  className="daisyui-btn daisyui-btn-info daisyui-btn-sm mr-2"
                  onClick={executeDeposit}
                  disabled={loadingDeposit[modalAddress]}
                >
                  {loadingDeposit[modalAddress] ? (
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
                    'Confirm'
                  )}
                </button>
                <button
                  className="daisyui-btn daisyui-btn-neutral daisyui-btn-sm"
                  onClick={handleToggle}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default Orchestration;
