import { useState, useContext } from 'react';
import { Range } from 'react-daisyui';
import { AmountMath } from '@agoric/ertp';
import { makeCopyBag } from '@endo/patterns';
import { AgoricWalletConnection, useAgoric } from '@agoric/react-components';
import { useContractStore } from '../../store/contract';
import { NotificationContext } from '../../context/NotificationContext';
import { DynamicToastChild } from '../Tabs';

const IST_UNIT = 1_000_000n;

const makeOffer = (
  wallet: AgoricWalletConnection,
  addNotification: (arg0: DynamicToastChild) => void,
  ticketKind: string,
  ticketValue: bigint,
  giveValue: bigint,
) => {
  const { instances, brands } = useContractStore.getState();
  const instance = instances?.['sellConcertTickets'];
  if (!instance) throw Error('no contract instance');
  if (!(brands && brands.IST && brands.Ticket))
    throw Error('brands not available');

  const choices: [string, bigint][] = [
    [ticketKind.toLowerCase() + 'Row', ticketValue],
  ];
  const choiceBag = makeCopyBag(choices);
  const ticketAmount = AmountMath.make(brands.Ticket, choiceBag);
  const want = { Tickets: ticketAmount };
  const give = { Price: { brand: brands.IST, value: giveValue * IST_UNIT } };

  wallet?.makeOffer(
    {
      source: 'contract',
      instance,
      publicInvitationMaker: 'makeTradeInvitation',
    },
    { give, want },
    undefined,
    (update: { status: string; data?: unknown }) => {
      if (update.status === 'error') {
        addNotification({
          text: `Offer error: ${update.data}`,
          status: 'error',
        });
      }
      if (update.status === 'accepted') {
        addNotification({
          text: 'Offer accepted',
          status: 'success',
        });
      }
      if (update.status === 'refunded') {
        addNotification({
          text: 'Offer refunded',
          status: 'warning',
        });
      }
    },
  );
};

const MintRow = ({
  kind,
  price,
  available,
}: {
  kind: string;
  price: number;
  available: number;
}) => {
  const [tickets, setTickets] = useState(1);
  const { walletConnection } = useAgoric();
  const { addNotification } = useContext(NotificationContext);

  return (
    <div>
      {/* Mint card */}
      <div className="daisyui-card bg-base-100 shadow-xl lg:daisyui-card-side">
        {/* card image */}
        <figure>
          <img
            src={'src/assets/' + kind.toLowerCase() + 'Row.jpg'}
            alt={kind + ' Row'}
          />
        </figure>
        {/* card body */}
        <div className="daisyui-card-body">
          {/* card title */}
          <h2 className="daisyui-card-title">{kind} Row</h2>
          {/* card description */}
          <p>{kind} row concert ticket</p>
          {/* ticket value selector */}
          <Range
            defaultValue={tickets}
            min={1}
            max={available}
            onChange={evt => setTickets(Number(evt.target.value))}
          />
          {/* card action */}
          <div className="daisyui-card-actions flex-col">
            {/* ticket price */}
            <div className="daisyui-stats shadow">
              <div className="daisyui-stat">
                <div className="daisyui-stat-figure text-primary">
                  <img src="src/assets/IST.png" />
                </div>
                <div className="daisyui-stat-title">Total Price</div>
                <div className="daisyui-stat-value text-secondary">
                  {tickets * price} IST
                </div>
                <div className="daisyui-stat-desc">{tickets} tickets</div>
              </div>
            </div>
            {/* mint button */}
            <button
              className="daisyui-btn daisyui-btn-primary self-center"
              onClick={() => {
                if (walletConnection) {
                  makeOffer(
                    walletConnection,
                    addNotification!,
                    kind,
                    BigInt(tickets),
                    BigInt(tickets * price),
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
              Mint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MintTickets = () => {
  return (
    <div>
      <MintRow kind="Front" available={3} price={3} />
      <div className="daisyui-divider"></div>
      <MintRow kind="Middle" available={3} price={2} />
      <div className="daisyui-divider"></div>
      <MintRow kind="Last" available={3} price={1} />
    </div>
  );
};

export { MintTickets };
