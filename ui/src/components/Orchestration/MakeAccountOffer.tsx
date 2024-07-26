import { AgoricWalletConnection } from '@agoric/react-components';
import { DynamicToastChild } from '../Tabs';
import { useContractStore } from '../../store/contract';

export const makeAccountOffer = async (
  wallet: AgoricWalletConnection,
  addNotification: (arg0: DynamicToastChild) => void,
  selectedChain: string,
  setLoadingCreateAccount: React.Dispatch<React.SetStateAction<boolean>>,
  handleToggle: () => void
) => {
  if (!selectedChain) {
    addNotification({
      text: `Please Select Chain`,
      status: 'error',
    });
    setLoadingCreateAccount(false);
    handleToggle();
    return;
  }

  const { instances } = useContractStore.getState();
  const instance = instances?.['orca'];

  if (!instance) {
    setLoadingCreateAccount(false);
    handleToggle();
    throw Error('no contract instance');
  }

  const want = {};
  const give = {};

  const makeAccountofferId = Date.now();

  await wallet?.makeOffer(
    {
      source: 'contract',
      instance, 
      publicInvitationMaker: 'makeAccountInvitation',
    },
    { give, want },
    { chainName: selectedChain },
    (update: { status: string; data?: unknown }) => {
      if (update.status === 'error') {
        addNotification({
          text: `offer update error: ${update.data}`,
          status: 'error',
        });
        setLoadingCreateAccount(false);
        handleToggle();
        console.log(update);
      }
      if (update.status === 'accepted') {
        addNotification({
          text: 'offer accepted successfully',
          status: 'success',
        });
        setLoadingCreateAccount(false);
        handleToggle();
        console.log(update);
      }
      if (update.status === 'refunded') {
        addNotification({
          text: 'offer was refunded',
          status: 'error',
        });
        setLoadingCreateAccount(false);
        handleToggle();
        console.log(update);
      }
    },
    makeAccountofferId
  );
};