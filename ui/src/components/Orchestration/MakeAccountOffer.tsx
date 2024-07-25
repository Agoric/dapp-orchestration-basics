import { AgoricWalletConnection } from '@agoric/react-components';
import { DynamicToastChild } from '../Tabs';
import { useContractStore } from '../../store/contract';

export const makeAccountOffer = async (
  wallet: AgoricWalletConnection,
  addNotification: (arg0: DynamicToastChild) => void,
  selectedChain: string
) => {
  if (!selectedChain) {
    addNotification({
      text: `Please Select Chain`,
      status: 'error',
    });
    return;
  }
  const { instances } = useContractStore.getState();
  const instance = instances?.['orca'];

  if (!instance) throw Error('no contract instance');

  const want = {};
  const give = {};

  const makeAccountofferId = Date.now();

  wallet?.makeOffer(
    {
      source: 'contract',
      instance, 
      publicInvitationMaker: 'makeAccountInvitation',
    },
    { give, want },
    { chainName: selectedChain },
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
    makeAccountofferId
  );
};