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
  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [loadingStake, setLoadingStake] = useState(false);
  const [loadingUnstake, setLoadingUnstake] = useState(false);
  const [loadingCreateAccount, setLoadingCreateAccount] = useState(false);
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
        const fetchedBalances = await fetchBalances(icas, selectedChain);
        setBalances(fetchedBalances);
      } catch (error) {
        console.error('Failed to fetch balances:', error);
      }
    };
    if (icas && icas.length > 0) {
      loadBalances();
    }
  }, [icas, selectedChain]);

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

  const handleDeposit = async (address: string) => {
    setLoadingDeposit(prevState => ({ ...prevState, [address]: true }));
    try {
      await initializeKeplr();
      let chain = '';
      if (address.startsWith('osmo1')) {
        chain = 'osmosis';
      } else if (address.startsWith('agoric1')) {
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
            toAddress: address,
            amount: [{ denom: "ubld", amount: "1000000" }],
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
            token: { denom: "uosmo", amount: "1000000" },
            sender: accounts[0].address,
            receiver: address,
            timeoutTimestamp: (Math.floor(Date.now() / 1000) + 600) * 1e9, // 10 minutes timeout
          },
        };
        const fee = {
          amount: [{ denom: "ubld", amount: "5000" }],
          gas: "200000",
        };
        const result = await client.signAndBroadcast(accounts[0].address, [sendMsg], fee, "");
        if (result.code !== undefined && result.code !== 0) {
          throw new Error(`Failed to send IBC transfer: ${result.log}`);
        }
        console.log("IBC transfer sent successfully");
      }
    } catch (error) {
      console.error("failed to deposit:", error);
    } finally {
      setLoadingDeposit(prevState => ({ ...prevState, [address]: false }));
    }
  };

  const handleWithdraw = (address: string) => {
    setLoadingWithdraw(prevState => ({ ...prevState, [address]: true }));
    // setLoadingWithdraw(false);
  };
  
  const handleStake = (address: string) => {
    setLoadingStake(prevState => ({ ...prevState, [address]: true }));
    // setLoadingStake(false);
  };
  
  const handleUnstake = (address: string) => {
    setLoadingUnstake(prevState => ({ ...prevState, [address]: true }));
    // setLoadingUnstake(false);
  };

  const guidelines = false

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

      {/* modal work */}
      {/* <dialog ref={modalRef} className="daisyui-modal">
        <div className="daisyui-modal-box w-8/12 max-w-5xl">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <Button onClick={handleToggle}>Open Modal</Button> */}
    </div>
  );
};

export default Orchestration;