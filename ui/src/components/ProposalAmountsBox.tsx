import { useState } from 'react';
import AmountRow from './SelectedAmountRow';
import AmountSelectorDialog from './AmountSelectorDialog';
import type { Amount, AssetKind } from '@agoric/web-components';
import type { PurseJSONState } from '@agoric/react-components';

type Props = {
  actionLabel: string;
  amounts: Amount[];
  onChange: (value: Amount[]) => void;
  address?: string;
  warning?: string;
  purses?: PurseJSONState<AssetKind>[];
};

const ProposalAmountsBox = ({
  actionLabel,
  amounts,
  onChange,
  purses,
  warning,
}: Props) => {
  const [isPurseSelectorOpen, setIsPurseSelectorOpen] = useState(false);

  return (
    <div className="w-full rounded-xl border-2 border-dashed border-primary p-4">
      {warning && (
        <div className="flex h-full items-center justify-center">
          <p className="text-warning">{warning}</p>
        </div>
      )}
      {amounts.length ? (
        <div className="mb-2 flex w-full flex-col items-center justify-start gap-4">
          {amounts.map(amount => (
            <AmountRow
              key={String(amount.brand)}
              amount={amount}
              onRemove={() =>
                onChange(amounts.filter(a => a.brand !== amount.brand))
              }
            />
          ))}
        </div>
      ) : (
        <></>
      )}
      {!warning && (
        <button
          onClick={() => setIsPurseSelectorOpen(true)}
          className="daisyui-btn daisyui-badge-neutral w-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          {actionLabel}
        </button>
      )}
      <AmountSelectorDialog
        purses={
          purses?.filter(
            ({ brand }) => !amounts.find(({ brand: b }) => b === brand),
          ) ?? []
        }
        isOpen={isPurseSelectorOpen}
        onClose={() => setIsPurseSelectorOpen(false)}
        onSelect={(amount: Amount) => {
          onChange([...amounts, amount]);
          setIsPurseSelectorOpen(false);
        }}
        label={actionLabel}
      />
    </div>
  );
};

export default ProposalAmountsBox;
