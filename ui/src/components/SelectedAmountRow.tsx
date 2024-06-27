import type { Amount } from '@agoric/web-components';
import { useDisplayInfo } from '../store/displayInfo';
import { AmountValue } from './DisplayAmount';

type Props = {
  amount: Amount;
  onRemove?: () => void;
};

const SelectedAmountRow = ({ amount, onRemove }: Props) => {
  const brandToDisplayInfo = useDisplayInfo(state => state.brandToDisplayInfo);
  const displayInfo = brandToDisplayInfo.get(amount.brand);

  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div className="flex flex-row items-center justify-start gap-2">
        <div className="daisyui-avatar daisyui-placeholder">
          <div className="w-10 rounded-full bg-base-100 text-neutral-content">
            {displayInfo && (
              <span>{displayInfo.petname.at(0)?.toUpperCase()}</span>
            )}
          </div>
        </div>
        <div className="text-sm font-medium">
          {displayInfo && (
            <span>
              <AmountValue amount={amount} displayInfo={displayInfo} />
            </span>
          )}
        </div>
      </div>
      <button
        onClick={onRemove}
        className="daisyui-btn daisyui-btn-circle daisyui-btn-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default SelectedAmountRow;
