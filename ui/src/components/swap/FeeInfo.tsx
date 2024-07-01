import type { Amount } from '@agoric/web-components';
import { AmountValue } from '../DisplayAmount';

type Props = {
  fee: Amount;
};

const FeeInfo = ({ fee }: Props) => {
  return (
    <p className="mx-1 mt-1">
      Swaparoo Fee:{' '}
      <AmountValue
        amount={fee}
        displayInfo={{ assetKind: 'nat', petname: 'IST', decimalPlaces: 6 }}
      />
    </p>
  );
};

export default FeeInfo;
