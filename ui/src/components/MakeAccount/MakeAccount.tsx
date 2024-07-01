import { useContext } from 'react';
import { AgoricWalletConnection, useAgoric } from '@agoric/react-components';
import { DynamicToastChild } from '../Tabs';
import { useContractStore } from '../../store/contract';
import { NotificationContext } from '../../context/NotificationContext';


const makeOffer = (
    wallet: AgoricWalletConnection,
    addNotification: (arg0: DynamicToastChild) => void,
    ticketKind: string,
    ticketValue: bigint,
    giveValue: bigint,
  ) => {
    const { instances, brands } = useContractStore.getState();
    const instance = instances?.['orca'];
    if (!instance) throw Error('no contract instance');
    console.log(brands)
    // if (!(brands && brands.IST && brands.Ticket))
    //   throw Error('brands not available');
  
    // const choices: [string, bigint][] = [
    //   [ticketKind.toLowerCase() + 'Row', ticketValue],
    // ];
    // const choiceBag = makeCopyBag(choices);
    // const ticketAmount = AmountMath.make(brands.Ticket, choiceBag);
    const want = { };
    const give = { };
  
    wallet?.makeOffer(
      {
        source: 'contract',
        instance,
        publicInvitationMaker: 'makeAccountInvitation',
      },
      { give, want },
      undefined,
      (update: { status: string; data?: unknown }) => {
        if (update.status === 'error') {
            console.log(status)
            console.log(update)
        }
        if (update.status === 'accepted') {
            console.log(update)
        }
        if (update.status === 'refunded') {
            console.log(update)
        }   
      },
    );
  };

// TODO: this can be for making an account
const MakeAccount = () => {
const { walletConnection } = useAgoric();
const { addNotification } = useContext(NotificationContext);

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
                  makeOffer(
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
        </div>
        
      </div>
    </div>
  );
};

export { MakeAccount };
