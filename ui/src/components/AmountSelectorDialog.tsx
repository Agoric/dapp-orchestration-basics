import type { PurseJSONState } from '@agoric/react-components';
import type { Amount, AssetKind } from '@agoric/web-components';
import { useEffect, useRef, useState } from 'react';
import { PurseValue } from './DisplayAmount';
import PurseAmountInput from './PurseAmountInput';

type Props = {
  label: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (amount: Amount) => void;
  purses: PurseJSONState<AssetKind>[];
};

const AmountSelectorDialog = ({
  isOpen,
  onClose,
  onSelect,
  purses,
  label,
}: Props) => {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<Amount | null>(null);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!modalRef.current) {
      return;
    }
    if (isOpen) {
      setSelectedBrand(null);
      setSelectedAmount(null);
      modalRef.current.showModal();
    } else {
      modalRef.current.close();
    }
  }, [isOpen]);

  const filteredPurses = purses.filter(p => !isPurseEmpty(p));

  const purseSelection = (
    <div className="flex flex-col gap-2">
      {filteredPurses.map(purse => (
        <button
          key={purse.brandPetname}
          onClick={() => setSelectedBrand(purse.brandPetname)}
          className="daisyui-btn daisyui-btn-ghost flex flex-row items-center justify-between px-2"
        >
          <PurseAmountDisplay purse={purse} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      ))}
    </div>
  );

  const amountInput = () => {
    const purse = purses.find(p => p.brandPetname === selectedBrand);
    return (
      <div className="px-2">
        <p className="font-medium italic">Select {selectedBrand} Amount</p>
        {purse && (
          <PurseAmountInput purse={purse} onChange={setSelectedAmount} />
        )}
      </div>
    );
  };

  const goBackToPurses = () => {
    setSelectedAmount(null);
    setSelectedBrand(null);
  };

  return (
    <dialog ref={modalRef} className="daisyui-modal">
      <div className="daisyui-modal-box flex flex-col overflow-hidden">
        <div className="mb-4 flex flex-row items-center justify-between">
          <h3 className="sticky text-lg font-bold">{label}</h3>
          <button
            onClick={onClose}
            className="daisyui-btn daisyui-btn-circle daisyui-btn-ghost daisyui-btn-sm"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto overflow-x-hidden">
          {selectedBrand ? amountInput() : purseSelection}
          {selectedBrand && (
            <div className="mt-4 flex flex-row items-center justify-end gap-3">
              <button
                onClick={goBackToPurses}
                className="daisyui-btn daisyui-btn-neutral"
              >
                Back
              </button>
              <button
                onClick={() => selectedAmount && onSelect(selectedAmount)}
                disabled={!selectedAmount}
                className="daisyui-btn daisyui-btn-primary"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
};

type PurseAmountDisplayProps = {
  purse: PurseJSONState<AssetKind>;
};

const PurseAmountDisplay = ({ purse }: PurseAmountDisplayProps) => {
  return (
    <div className="flex flex-row items-center justify-start gap-2">
      <div className="daisyui-avatar daisyui-placeholder">
        <div className="w-10 rounded-full bg-base-300 text-neutral-content">
          <span>{purse.brandPetname.at(0)?.toUpperCase()}</span>
        </div>
      </div>
      <div className="flex flex-col items-start justify-around">
        <div className="font-medium">{purse.brandPetname}</div>
        <div className="text-sm">
          <PurseValue purse={purse} allowPopup={false} />
        </div>
      </div>
    </div>
  );
};

const isPurseEmpty = (purse: PurseJSONState<AssetKind>) => {
  const { assetKind } = purse.displayInfo;
  const { value } = purse.currentAmount;
  if (assetKind === 'nat') {
    return value === 0n;
  }
  if (assetKind === 'set') {
    // UNTIL: https://github.com/Agoric/agoric-sdk/issues/9378
    return true;
  }
  if (assetKind === 'copyBag') {
    return value.payload.length === 0;
  }

  console.error('unrecognized asset kind in purse - ' + assetKind);
  return true;
};

export default AmountSelectorDialog;
