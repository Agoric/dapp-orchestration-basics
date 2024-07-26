import React, { useState, useContext, useEffect, useRef } from 'react';
import { useAgoric } from '@agoric/react-components';
import { useContractStore } from '../../store/contract';
import { NotificationContext } from '../../context/NotificationContext';
import { Button } from 'react-daisyui';
import AccountList from './AccountList';
import ChainSelector from './ChainSelector';
import CreateAccountButton from './CreateAccountButton';
import { fetchBalances } from './FetchBalances';
import { makeAccountOffer } from './MakeAccountOffer';
import { initializeKeplr } from './KeplrInitializer';
import RpcEndpoints from './RpcEndpoints';
import { StargateClient, SigningStargateClient } from "@cosmjs/stargate";

const Orchestration = () => {
  const { walletConnection } = useAgoric();
  const { addNotification } = useContext(NotificationContext);
  const [offerId, setOfferId] = useState('');
  const icas = useContractStore(state => state.icas);
  const [balances, setBalances] = useState([]);
  const [selectedChain, setSelectedChain] = useState('');
  const [loadingDeposit, setLoadingDeposit] = useState<{ [key: string]: boolean }>({});
  const [loadingWithdraw, setLoadingWithdraw] = useState<{ [key: string]: boolean }>({});
  const [loadingStake, setLoadingStake] = useState<{ [key: string]: boolean }>({});
  const [loadingUnstake, setLoadingUnstake] = useState<{ [key: string]: boolean }>({});
  const [loadingCreateAccount, setLoadingCreateAccount] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAddress, setModalAddress] = useState('');
  const [selectedDenom, setSelectedDenom] = useState('uist');
  const [amount, setAmount] = useState(0);
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const guidelines = false;

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

  const openModal = (content: string, address: string = '') => {
    setModalContent(content);
    setModalAddress(address);
    handleToggle();
  };

  useEffect(() => {
    const loadBalances = async () => {
      try {
        const fetchedBalances = await fetchBalances(icas, selectedChain);
        setBalances(fetchedBalances);
      } catch (error) {
        console.error('failed to fetch balances:', error);
      }
    };
    if (icas && icas.length > 0) {
      loadBalances();
    }
  }, [icas, selectedChain]);


  const handleCreateAccount = () => {
    openModal('Create Account');
    setLoadingCreateAccount(true);

    if (walletConnection) {
      makeAccountOffer(walletConnection, addNotification!, selectedChain)
        .then(() => {
            setLoadingCreateAccount(false);
            handleToggle(); 
        })
        .catch((error) => {
          addNotification!({
            text: `transaction failed: ${error.message}`,
            status: 'error',
          });
          handleToggle(); 
        //   setLoadingCreateAccount(false);
        })
        .finally(() => {
            handleToggle(); 
            setLoadingCreateAccount(false);
        });
    } else {
      addNotification!({
        text: 'error: please connect your wallet or check your connection to RPC endpoints',
        status: 'error',
      });
    //   setLoadingCreateAccount(false); 
      handleToggle(); 
    }
  };

  const handleDeposit = (address: string) => {
    openModal('Deposit', address);
  };

  const executeDeposit = async () => {
    setLoadingDeposit(prevState => ({ ...prevState, [modalAddress]: true }));
    try {
      await initializeKeplr();
      let chain = '';
      if (modalAddress.startsWith('osmo1')) {
        chain = 'osmosis';
      } else if (modalAddress.startsWith('agoric1')) {
        chain = 'agoric';
      } else {
        throw new Error('unsupported address prefix');
      }
      if (chain === 'agoric') {
        await window.keplr.enable(`${chain}local`);
        const offlineSigner = window.getOfflineSigner(`${chain}local`);
        const accounts = await offlineSigner.getAccounts();
        const client = await SigningStargateClient.connectWithSigner(`${RpcEndpoints[chain]}`, offlineSigner);
        const sendMsg = {
          typeUrl: "/cosmos.bank.v1beta1.MsgSend",
          value: {
            fromAddress: accounts[0].address,
            toAddress: modalAddress,
            amount: [{ denom: selectedDenom, amount: amount.toString() }],
          },
        };
        const fee = {
          amount: [{ denom: "ubld", amount: "5000" }],
          gas: "200000",
        };
        const result = await client.signAndBroadcast(accounts[0].address, [sendMsg], fee, "");
        if (result.code !== undefined && result.code !== 0) {
          throw new Error(`failed to send message: ${result.log}`);
        }
        console.log("message sent successfully");
      } else {
        await window.keplr.enable(`${chain}local`);
        const offlineSigner = window.getOfflineSigner(`${chain}local`);
        const accounts = await offlineSigner.getAccounts();
        const client = await SigningStargateClient.connectWithSigner(`${RpcEndpoints[chain]}`, offlineSigner);
        const sendMsg = {
          typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
          value: {
            sourcePort: "transfer",
            sourceChannel: "channel-0",
            token: { denom: selectedDenom, amount: amount.toString() },
            sender: accounts[0].address,
            receiver: modalAddress,
            timeoutTimestamp: (Math.floor(Date.now() / 1000) + 600) * 1e9, //10 
          },
        };
        const fee = {
          amount: [{ denom: "ubld", amount: "5000" }],
          gas: "200000",
        };
        const result = await client.signAndBroadcast(accounts[0].address, [sendMsg], fee, "");
        console.log(result)
        if (result.code !== undefined && result.code !== 0) {
          throw new Error(`Failed to send IBC transfer: ${result.log}`);
        }
        console.log("IBC transfer sent successfully");
      }
    } catch (error) {
      console.error("failed to deposit:", error);
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
        <div className={`flex flex-row justify-between items-start space-x-10 border${guidelines ? "" : "-0"}`}>
  
          <AccountList balances={balances} handleDeposit={handleDeposit} handleWithdraw={handleWithdraw} handleStake={handleStake} handleUnstake={handleUnstake} loadingDeposit={loadingDeposit} loadingWithdraw={loadingWithdraw} loadingStake={loadingStake} loadingUnstake={loadingUnstake} guidelines={guidelines} />
  
          <div className={`flex flex-col w-1/2 space-y-4 pl-4 rounded-lg p-4 border${guidelines ? "" : "-0"}`}>
            <ChainSelector setSelectedChain={setSelectedChain} />
            <CreateAccountButton handleCreateAccount={handleCreateAccount} loadingCreateAccount={loadingCreateAccount} />
          </div>
        </div>
      </div>
  
        {/* modal */}
        <dialog ref={modalRef} className="daisyui-modal">
            <div className="daisyui-modal-box w-full max-w-md">
                <button className="daisyui-btn daisyui-btn-sm daisyui-btn-circle daisyui-btn-neutral absolute right-2 top-2" onClick={handleToggle}>✕</button>
                <h3 className="font-bold text-lg">{modalContent}</h3>
                <p className="py-4">Modal for {modalContent}.</p>
                {modalContent === 'Deposit' && (
                <div>
                    <label className="block">
                    <span className="text-gray-700">Select Denom</span>
                    <select value={selectedDenom} onChange={e => setSelectedDenom(e.target.value)} className="form-select mt-1 block w-1/2">
                        <option value="ubld">BLD</option>
                        <option value="uist">IST</option>
                        <option value="uosmo">OSMO</option>
                        {/* Add more options as needed */}
                    </select>
                    </label>
                    <label className="block mt-4">
                    <span className="text-gray-700">Amount</span>
                    <input type="number" value={amount} onChange={e => setAmount(parseInt(e.target.value))} className="form-input mt-1 block w-1/2" />
                    </label>
                    <div className="modal-action mt-4">
                    <button className="daisyui-btn daisyui-btn-info daisyui-btn-sm mr-2" onClick={executeDeposit} disabled={loadingDeposit[modalAddress]}>
                        {loadingDeposit[modalAddress] ? (
                        <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                        </svg>
                        ) : 'Confirm'}
                    </button>
                    <button className="daisyui-btn daisyui-btn-sm daisyui-btn-neutral" onClick={handleToggle}>Close</button>
                    </div>
                </div>
                )}
            </div>
        </dialog>
    </div>
  );
}

export default Orchestration;