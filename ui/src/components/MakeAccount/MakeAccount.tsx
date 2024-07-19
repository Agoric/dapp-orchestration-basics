import { useContext, useState } from 'react';
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
  const instance = instances?.['orca'];
  if (!instance) throw Error('no contract instance');

  const want = {};
  const give = {};

  // const makeAccountofferId = `makeAccount-${Date.now()}`;
  const makeAccountofferId = Date.now();

  // Make the initial offer
  wallet?.makeOffer(
    {
      // source: 'contract',
      // instance, 
      // publicInvitationMaker: 'makeAccountInvitation',
      source: 'agoricContract',
      instancePath: ['orca'],
      callPipe: [['makeAccountInvitation']],
    },
    { give, want },
    undefined,
    (update: { status: string; data?: unknown }) => {
      if (update.status === 'error') {
        console.log(update);
      }
      if (update.status === 'accepted') {
        console.log(update);
        // Proceed with the continuing offer only if the initial offer is accepted
        wallet?.makeOffer(
          {
            source: 'continuing',
            previousOffer: makeAccountofferId, // Replace 100 with the actual offer ID
            invitationMakerName: 'makeAccountInvitation',
          },
          { give, want },
          undefined,
          (continuingUpdate: { status: string; data?: unknown }) => {
            if (continuingUpdate.status === 'error') {
              console.log(continuingUpdate);
            }
            if (continuingUpdate.status === 'accepted') {
              console.log(continuingUpdate);
            }
            if (continuingUpdate.status === 'refunded') {
              console.log(continuingUpdate);
            }
          },
          1
        );
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
      previousOffer: Number(offerId),
      invitationMakerName: 'makeAccountInvitation',
    },
    { give, want },
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
    1
  );
};

// TODO: this can be for making an account
const MakeAccount = () => {
const { walletConnection } = useAgoric();
const { addNotification } = useContext(NotificationContext);
const [offerId, setOfferId] = useState('');

  return (
    <div className="flex w-full flex-row justify-center">
      <div className="flex w-11/12 flex-row">
        <div className="card grid h-full flex-grow place-items-center rounded-box">
          Agoric Balance
        </div>
        <div className="daisyui-divider lg:daisyui-divider-horizontal"></div>
        <div className="card grid h-full flex-grow place-items-center rounded-box">
          Token Balance
        </div>
        <div className="card grid h-full flex-grow place-items-center rounded-box">
        <button
              className="daisyui-btn daisyui-btn-primary self-center"
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
            className="daisyui-btn daisyui-btn-primary self-center"
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
  );
};

export { MakeAccount };
