import { useAgoric } from '@agoric/react-components';
import ProposalAmountsBox from '../ProposalAmountsBox';
import RecipientInput from '../RecipientInput';
import { queryPurses } from '../../utils/queryPurses';
import { useContext, useEffect, useState } from 'react';
import type { Amount } from '@agoric/web-components';
import { useDisplayInfo } from '../../store/displayInfo';
import { NotificationContext } from '../../context/NotificationContext';
import { queryIssuers } from '../../utils/queryIssuers';

const Pay = () => {
  const { addNotification } = useContext(NotificationContext);
  const { purses, chainStorageWatcher, makeOffer } = useAgoric();
  const [recipientAddr, setRecipientAddr] = useState('');
  const [recipientError, setRecipientError] = useState('');
  const [myAmounts, setMyAmounts] = useState<Amount[]>([]);
  const { brandToDisplayInfo } = useDisplayInfo(({ brandToDisplayInfo }) => ({
    brandToDisplayInfo,
  }));

  useEffect(() => {
    let isCancelled = false;
    const checkRecipientSmartWallet = async () => {
      if (chainStorageWatcher && recipientAddr) {
        try {
          await queryPurses(chainStorageWatcher, recipientAddr);
        } catch (e) {
          if (!isCancelled) {
            setRecipientError('Failed to fetch recipient wallet.');
          }
        }
      }
    };

    if (!recipientAddr.length) {
      setRecipientError('');
    } else if (
      recipientAddr.startsWith('agoric') &&
      recipientAddr.length === 45
    ) {
      setRecipientError('');
      checkRecipientSmartWallet();
    } else {
      setRecipientError('Invalid address format');
    }

    return () => {
      isCancelled = true;
    };
  }, [chainStorageWatcher, recipientAddr]);

  const sendOffer = async () => {
    assert(chainStorageWatcher && makeOffer);

    assert(chainStorageWatcher && makeOffer);
    try {
      const brandPetnameToIssuer = await queryIssuers(chainStorageWatcher);
      const issuers = new Set(
        [...myAmounts].map(amount => {
          const { petname } = brandToDisplayInfo.get(amount.brand)!;
          return brandPetnameToIssuer.get(petname);
        }),
      );

      const invitationSpec = {
        source: 'agoricContract',
        instancePath: ['postalService'],
        callPipe: [['makeSendInvitation', [recipientAddr, [...issuers]]]],
      };

      const gives = myAmounts.map(amount => {
        const { petname } = brandToDisplayInfo.get(amount.brand)!;
        return [petname, amount];
      });
      const proposal = {
        give: { ...Object.fromEntries(gives) },
        want: {},
      };

      makeOffer(
        invitationSpec,
        proposal,
        undefined,
        (update: { status: string; data?: unknown }) => {
          if (update.status === 'error') {
            addNotification!({
              text: `Payment Error: ${update.data}`,
              status: 'error',
            });
          }
          if (update.status === 'accepted') {
            addNotification!({
              text: 'Payment Sent',
              status: 'success',
            });
          }
          if (update.status === 'refunded') {
            addNotification!({
              text: 'Payment Refunded',
              status: 'warning',
            });
          }
        },
      );
    } catch (e) {
      addNotification!({
        text: `Offer error: ${e}`,
        status: 'error',
      });
    }
  };

  const isButtonDisabled = !makeOffer || !recipientAddr || !myAmounts.length;

  return (
    <div className="items-top flex w-full flex-col justify-around lg:flex-row">
      <div>
        <h2 className="daisyui-card-title mb-2 w-full">Send Payment</h2>
        <div className="daisyui-card h-fit w-96 bg-base-300 px-4 py-4 shadow-xl">
          <RecipientInput
            address={recipientAddr}
            onChange={addr => setRecipientAddr(addr)}
            error={recipientError}
          />
          <div className="my-1">
            <h2 className="mb-2 text-lg font-medium">Give</h2>
            <ProposalAmountsBox
              actionLabel="Add from Your Purse"
              amounts={myAmounts}
              purses={purses}
              onChange={setMyAmounts}
              warning={purses ? undefined : 'Wallet Not Connected'}
            />
          </div>
          <button
            onClick={sendOffer}
            disabled={isButtonDisabled}
            className="daisyui-btn daisyui-btn-primary mt-4 w-full self-center text-lg"
          >
            Send Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pay;
