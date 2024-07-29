import { AgoricWalletConnection } from '@agoric/react-components';
import { DynamicToastChild } from '../Tabs';
import { useContractStore } from '../../store/contract';

export const makeAccountOffer = async (
  wallet: AgoricWalletConnection,
  addNotification: (arg0: DynamicToastChild) => void,
  selectedChain: string,
  setLoadingCreateAccount: React.Dispatch<React.SetStateAction<boolean>>,
  handleToggle: () => void,
  setStatusText: React.Dispatch<React.SetStateAction<string>>
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
    async (update: { status: string; data?: unknown }) => {
      if (update.status === 'error') {
        const msg = `offer update error: ${update.data}`
        addNotification({
          text: msg,
          status: 'error',
        });
        setLoadingCreateAccount(false);
        handleToggle();
        console.log(update);
        setStatusText(msg)
      }
      if (update.status === 'accepted') {
        const msg = 'Account created successfully'
        addNotification({
          text: msg,
          status: 'success',
        });
        console.log(update);
        setStatusText(msg);

        setTimeout(() => {
            const msg = 'Account created successfully'
            addNotification({
            text: msg,
            status: 'success',
            });
            setLoadingCreateAccount(false);
            handleToggle();
            setStatusText(msg);
        }, 2000); 
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