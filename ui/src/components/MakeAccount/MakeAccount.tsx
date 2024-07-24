import { useContext, useState, useEffect } from 'react';
import { AgoricWalletConnection, useAgoric } from '@agoric/react-components';
import { DynamicToastChild } from '../Tabs';
import { useContractStore } from '../../store/contract';
import { NotificationContext } from '../../context/NotificationContext';

const makeAndContinueOffer = async (
  wallet: AgoricWalletConnection,
  addNotification: (arg0: DynamicToastChild) => void,
  ticketKind: string,
  ticketValue: bigint,
  giveValue: bigint
) => {
  const { instances, brands } = useContractStore.getState();
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
    { chainName: "osmosis"},
    // {},
    (update: { status: string; data?: unknown }) => {
      if (update.status === 'error') {
        console.log(update);
      }
      if (update.status === 'accepted') {
        console.log(update);
        // // Proceed with the continuing offer only if the initial offer is accepted
        // wallet?.makeOffer(
        //   {
        //     source: 'continuing',
        //     previousOffer: makeAccountofferId, // Replace 100 with the actual offer ID
        //     invitationMakerName: 'makeAccountInvitation',
        //   },
        //   { give, want },
        //   undefined,
        //   (continuingUpdate: { status: string; data?: unknown }) => {
        //     if (continuingUpdate.status === 'error') {
        //       console.log(continuingUpdate);
        //     }
        //     if (continuingUpdate.status === 'accepted') {
        //       console.log(continuingUpdate);
        //     }
        //     if (continuingUpdate.status === 'refunded') {
        //       console.log(continuingUpdate);
        //     }
        //   },
        //   1000
        // );
      }
      if (update.status === 'refunded') {
        console.log(update);
      }
    },
    makeAccountofferId
  );
};

const continueOfferWithId = (
  wallet: AgoricWalletConnection,
  addNotification: (arg0: DynamicToastChild) => void,
  offerId: string,
  ticketKind: string,
  ticketValue: bigint,
  giveValue: bigint
) => {
  const { instances, brands } = useContractStore.getState();
  const instance = instances?.['orca'];
  if (!instance) throw Error('no contract instance');

  const want = {};
  const give = {};

  wallet?.makeOffer(
    {
      source: 'continuing',
      // source: 'offer',
      previousOffer: Number(offerId),
      invitationMakerName: 'makeAccountInvitation', //delegate
    },
    {}, //{ give, want },
    undefined,
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
    10000
  );
};

// TODO: this can be for making an account

const MakeAccount = () => {
  const { walletConnection } = useAgoric();
  const { addNotification } = useContext(NotificationContext);
  const [offerId, setOfferId] = useState('');

  const addresses = [
    { address: 'agoric1...', agoricBalance: 1000, tokenBalance: 500 },
    { address: 'agoric2...', agoricBalance: 1100, tokenBalance: 550 },
    { address: 'agoric3...', agoricBalance: 1200, tokenBalance: 600 },
  ];

  const [balances, setBalances] = useState([]);
  const [selectedChain, setSelectedChain] = useState('agoric');

  useEffect(() => {
    // const loadBalances = async () => {
    //   try {
    //     const fetchedBalances = await fetchBalances(addresses);
    //     setBalances(fetchedBalances);
    //   } catch (error) {
    //     console.error('Failed to fetch balances:', error);
    //   }
    // };
    // loadBalances();
  }, [addresses]);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="w-full max-w-6xl p-4">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col w-2/5 space-y-4">
            {addresses.map((addr, idx) => (
              <div key={idx} className="card bg-base-100 shadow-md p-4">
                <p>Address: {addr.address}</p>
                <p>Agoric Balance: {addr.agoricBalance}</p>
                <p>Token Balance: {addr.tokenBalance}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col w-2/5 space-y-4">
            <select
              className="select select-bordered"
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
            >
              <option value="agoric">Agoric</option>
              <option value="cosmos">Cosmos</option>
              <option value="osmosis">Osmosis</option>
            </select>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (walletConnection) {
                  makeAndContinueOffer(
                    walletConnection,
                    addNotification!,
                    "dev",
                    BigInt(1),
                    BigInt(1),
                  );
                } else {
                  addNotification!({
                    text: 'error: please connect your wallet or check your connection to RPC endpoints',
                    status: 'error',
                  });
                  return;
                }
              }}
            >
              Create Account
            </button>

            <input
              type="text"
              value={offerId}
              onChange={(e) => setOfferId(e.target.value)}
              placeholder="Enter previous offer ID"
              className="input input-bordered"
            />
            <button
              className="btn btn-primary"
              onClick={() => {
                if (walletConnection) {
                  continueOfferWithId(
                    walletConnection,
                    addNotification!,
                    offerId,
                    "dev",
                    BigInt(1),
                    BigInt(1)
                  );
                } else {
                  addNotification!({
                    text: 'error: please connect your wallet or check your connection to RPC endpoints',
                    status: 'error',
                  });
                  return;
                }
              }}
            >
              Continue Offer with ID
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MakeAccount };