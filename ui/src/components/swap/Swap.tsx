import { type PurseJSONState, useAgoric } from '@agoric/react-components';
import ProposalAmountsBox from '../ProposalAmountsBox';
import RecipientInput from '../RecipientInput';
import { queryPurses } from '../../utils/queryPurses';
import { useContext, useEffect, useState } from 'react';
import type { Amount, AssetKind } from '@agoric/web-components';
import { useDisplayInfo } from '../../store/displayInfo';
import {
  type ChainStorageWatcher,
  AgoricChainStoragePathKind,
} from '@agoric/rpc';
import FeeInfo from './FeeInfo';
import { queryIssuers } from '../../utils/queryIssuers';
import { NotificationContext } from '../../context/NotificationContext';
import IncomingOffers from './IncomingOffers';

const useFee = (chainStorageWatcher?: ChainStorageWatcher) => {
  const [fee, setFee] = useState<Amount | null>(null);

  useEffect(() => {
    if (!chainStorageWatcher) return;
    const fetchFee = async () => {
      const terms = await chainStorageWatcher.queryOnce([
        AgoricChainStoragePathKind.Data,
        'published.swaparoo.governance',
      ]);
      // @ts-expect-error cast
      const { Fee } = terms.current;
      setFee(Fee.value);
    };

    fetchFee();
  }, [chainStorageWatcher]);

  return fee;
};

const Swap = () => {
  const { addNotification } = useContext(NotificationContext);
  const { purses, chainStorageWatcher, makeOffer } = useAgoric();
  const [recipientAddr, setRecipientAddr] = useState('');
  const [recipientPurses, setRecipientPurses] = useState<
    PurseJSONState<AssetKind>[]
  >([]);
  const [recipientError, setRecipientError] = useState('');
  const [myAmounts, setMyAmounts] = useState<Amount[]>([]);
  const [recipientAmounts, setRecipientAmounts] = useState<Amount[]>([]);
  const { brandToDisplayInfo, savePurseInfo } = useDisplayInfo(
    ({ brandToDisplayInfo, savePurseInfo }) => ({
      brandToDisplayInfo,
      savePurseInfo,
    }),
  );
  const fee = useFee(chainStorageWatcher);

  useEffect(() => {
    savePurseInfo([...(purses ?? []), ...recipientPurses]);
  }, [recipientPurses, purses, savePurseInfo]);

  useEffect(() => {
    let isCancelled = false;
    const queryRecipientPurses = async () => {
      if (chainStorageWatcher && recipientAddr) {
        try {
          const purses = await queryPurses(chainStorageWatcher, recipientAddr);
          if (!isCancelled) {
            setRecipientPurses(purses);
          }
        } catch (e) {
          if (!isCancelled) {
            setRecipientError('Failed to fetch recipient wallet.');
          }
        }
      }
    };

    setRecipientAmounts([]);
    setRecipientPurses([]);

    if (!recipientAddr.length) {
      setRecipientError('');
    } else if (
      recipientAddr.startsWith('agoric') &&
      recipientAddr.length === 45
    ) {
      setRecipientError('');
      queryRecipientPurses();
    } else {
      setRecipientError('Invalid address format');
    }

    return () => {
      isCancelled = true;
    };
  }, [chainStorageWatcher, recipientAddr]);

  const sendOffer = async () => {
    assert(chainStorageWatcher && makeOffer);
    try {
      const brandPetnameToIssuer = await queryIssuers(chainStorageWatcher);
      const issuers = new Set(
        [...myAmounts, ...recipientAmounts, ...(fee ? [fee] : [])].map(
          amount => {
            const { petname } = brandToDisplayInfo.get(amount.brand)!;
            return brandPetnameToIssuer.get(petname);
          },
        ),
      );

      const invitationSpec = {
        source: 'agoricContract',
        instancePath: ['swaparoo'],
        callPipe: [['makeFirstInvitation', [[...issuers]]]],
      };
      const offerArgs = { addr: recipientAddr };

      const gives = myAmounts.map(amount => {
        const { petname } = brandToDisplayInfo.get(amount.brand)!;
        return [petname, amount];
      });
      const wants = recipientAmounts.map(amount => {
        const { petname } = brandToDisplayInfo.get(amount.brand)!;
        return [petname, amount];
      });
      const proposal = {
        give: { ...Object.fromEntries(gives), Fee: fee },
        want: { ...Object.fromEntries(wants) },
      };

      makeOffer(
        invitationSpec,
        proposal,
        offerArgs,
        (update: { status: string; data?: unknown }) => {
          if (update.status === 'seated') {
            addNotification!({
              text: `Offer Sent`,
              status: 'success',
            });
          }
          if (update.status === 'error') {
            addNotification!({
              text: `Offer error: ${update.data}`,
              status: 'error',
            });
          }
          if (update.status === 'accepted') {
            addNotification!({
              text: 'Offer accepted',
              status: 'success',
            });
          }
          if (update.status === 'refunded') {
            addNotification!({
              text: 'Offer refunded',
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

  const isButtonDisabled =
    !makeOffer ||
    !recipientAddr ||
    !(myAmounts.length || recipientAmounts.length);

  return (
    <div className="items-top flex w-full flex-col justify-around lg:flex-row">
      <div>
        <h2 className="daisyui-card-title mb-2 w-full">Create Swap Offer</h2>
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
          <div className="my-1">
            <h2 className="mb-2 text-lg font-medium">Want</h2>
            <ProposalAmountsBox
              actionLabel="Add from Recipient Purse"
              amounts={recipientAmounts}
              onChange={setRecipientAmounts}
              purses={recipientPurses}
              warning={
                recipientPurses.length ? undefined : 'Enter Recipient Address'
              }
            />
          </div>
          {fee && <FeeInfo fee={fee} />}
          <button
            onClick={sendOffer}
            disabled={isButtonDisabled}
            className="daisyui-btn daisyui-btn-primary mt-4 w-full self-center text-lg"
          >
            Send Offer
          </button>
        </div>
      </div>
      <div className="daisyui-divider lg:daisyui-divider-horizontal"></div>
      <IncomingOffers />
    </div>
  );
};

export default Swap;
