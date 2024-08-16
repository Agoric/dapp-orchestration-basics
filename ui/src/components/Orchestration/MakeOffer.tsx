import { AgoricWalletConnection } from '@agoric/react-components';
import { DynamicToastChild } from '../Tabs';
import { useContractStore } from '../../store/contract';

export const makeOffer = async (
  wallet: AgoricWalletConnection,
  addNotification: (arg0: DynamicToastChild) => void,
  selectedChain: string,
  publicInvitationMaker: string,
  offerArgs: Record<string, unknown>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  handleToggle: () => void,
  setStatusText: React.Dispatch<React.SetStateAction<string>>,
) => {
  if (!selectedChain) {
    addNotification({
      text: `Please Select Chain`,
      status: 'error',
    });
    setLoading(false);
    handleToggle();
    return;
  }

  const { instances, brands } = useContractStore.getState();
  const instance = instances?.['orca'];

  if (!instance || !brands) {
    setLoading(false);
    handleToggle();
    throw Error('No contract instance or brands found.');
  }

  // fetch the BLD brand
  const bldBrand = brands.BLD;
  if (!bldBrand) {
    setLoading(false);
    handleToggle();
    throw Error('BLD brand not found.');
  }

  const want = {};
  const give = { Deposit: { brand: bldBrand, value: BigInt(1000) } };

  const offerId = Date.now();

  await wallet?.makeOffer(
    {
      source: 'contract',
      instance,
      publicInvitationMaker,
    },
    { give, want },
    offerArgs,
    (update: { status: string; data?: unknown }) => {
      if (update.status === 'error') {
        addNotification({
          text: `Offer update error: ${update.data}`,
          status: 'error',
        });
        setStatusText('Error during offer submission.');
        setLoading(false);
        handleToggle();
        console.log(update);
      }
      if (update.status === 'accepted') {
        addNotification({
          text: 'Offer accepted successfully',
          status: 'success',
        });
        setStatusText('Offer accepted. Processing...');
        handleToggle();
        setLoading(false);
      }
      if (update.status === 'refunded') {
        addNotification({
          text: 'Offer was refunded',
          status: 'error',
        });
        setStatusText('Offer refunded.');
        setLoading(false);
        handleToggle();
        console.log(update);
      }
      if (update.status === 'done') {
        setStatusText('Operation completed successfully.');
        setLoading(false);
        setTimeout(() => {
          handleToggle();
        }, 1000);
      }
    },
    offerId,
  );
};
