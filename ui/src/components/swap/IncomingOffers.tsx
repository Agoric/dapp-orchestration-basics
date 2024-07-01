import { usePurse } from '../../hooks/usePurse';
import { useContractStore } from '../../store/contract';
import { stringifyData } from '../../utils/stringify';
import IncomingOffer from './IncomingOffer';

const IncomingOffers = () => {
  const { instances } = useContractStore();
  const swaparooInstance = instances?.['swaparoo'];
  const invitationPurse = usePurse('Invitation');
  const swaparooInvitations = invitationPurse?.currentAmount.value.filter(
    ({ instance, description }: { instance: unknown; description: string }) =>
      instance === swaparooInstance && description.startsWith('matchOffer'),
  ) as Array<unknown>[] | undefined;

  return (
    <div className="w-80">
      <h2 className="daisyui-card-title mb-2">Incoming Offers</h2>
      <div className="flex flex-col items-start justify-center gap-4">
        {(swaparooInvitations?.length &&
          swaparooInvitations?.map(inv => (
            <IncomingOffer
              // @ts-expect-error cast
              invitation={inv}
              key={stringifyData(inv)}
            ></IncomingOffer>
          ))) || <div>None</div>}
      </div>
    </div>
  );
};

export default IncomingOffers;
