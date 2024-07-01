import type { PurseJSONState } from '@agoric/react-components';
import type { DisplayInfoForBrand } from '../store/displayInfo';
import { stringifyValue, type AssetKind } from '@agoric/web-components';
import type { Amount } from '@agoric/ertp/src/types';
import { isCopyBagValue } from '@agoric/ertp';
import { useEffect, useRef, useState } from 'react';
import { stringifyData } from '../utils/stringify';

export const PurseValue = ({
  purse,
  allowPopup,
}: {
  purse: PurseJSONState<AssetKind>;
  allowPopup?: boolean;
}) => {
  const displayInfoForBrand: DisplayInfoForBrand = {
    assetKind: purse.displayInfo.assetKind,
    decimalPlaces: purse.displayInfo.decimalPlaces,
    petname: purse.brandPetname,
  };

  return (
    <AmountValue
      amount={purse.currentAmount}
      displayInfo={displayInfoForBrand}
      allowPopup={allowPopup}
    />
  );
};

export const AmountValue = ({
  amount,
  displayInfo,
  allowPopup,
}: {
  amount: Amount;
  displayInfo: DisplayInfoForBrand;
  allowPopup?: boolean;
}) => {
  if (displayInfo.assetKind === 'copySet') {
    console.error('Trying to display copySet amount - unimplemented.');
    return <></>;
  }

  return displayInfo.assetKind === 'nat' ? (
    <span>
      {stringifyValue(
        amount.value,
        displayInfo.assetKind,
        displayInfo.decimalPlaces,
      )}{' '}
      {displayInfo.petname}
    </span>
  ) : (
    <NonNatValue
      value={amount.value}
      allowPopup={allowPopup}
      petname={displayInfo.petname}
    />
  );
};

export const NonNatValue = ({
  value,
  petname,
  allowPopup = true,
}: {
  value: Amount<'set'>['value'] | Amount<'copyBag'>['value'];
  petname: string;
  allowPopup?: boolean;
}) => {
  const isCopyBag = isCopyBagValue(harden(value));
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!modalRef.current) {
      return;
    }
    if (isOpen) {
      modalRef.current.showModal();
    } else {
      modalRef.current.close();
    }
  }, [isOpen]);

  const count = isCopyBag
    ? String(
        value.payload.reduce(
          // @ts-expect-error cast
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (total, [_, count]) => total + count,
          0n,
        ),
      )
    : value.length;

  const items = isCopyBag
    ? value.payload.map((entry: [unknown, bigint]) => (
        <CopyBagEntry
          key={stringifyData(entry[0])}
          className="mb-4"
          entry={entry}
        />
      ))
    : value.map((entry: unknown) => (
        <SetEntry className="mb-4" key={stringifyData(entry)} entry={entry} />
      ));

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsOpen(true);
  };

  return allowPopup ? (
    <span>
      <a onClick={handleClick} href="#" className="underline">
        {count} {petname}
      </a>
      <dialog ref={modalRef} className="daisyui-modal">
        <div className="daisyui-modal-box flex flex-col overflow-hidden">
          <div className="mb-4 flex flex-row items-center justify-between">
            <h3 className="sticky text-lg font-bold">{petname}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="daisyui-btn daisyui-btn-circle daisyui-btn-ghost daisyui-btn-sm"
            >
              ✕
            </button>
          </div>
          <div className="overflow-y-auto overflow-x-hidden">{items}</div>
        </div>
      </dialog>
    </span>
  ) : (
    <span>
      {count} {petname}
    </span>
  );
};

export const CopyBagEntry = ({
  className,
  entry,
}: {
  className?: string;
  entry: [unknown, bigint];
}) => {
  return (
    <div
      className={`border-base rounded-xl border-[1px] border-solid px-4 ${className ?? ''}`}
    >
      <div className="daisyui-badge daisyui-badge-neutral my-3 p-3">
        Count: {String(entry[1])}
      </div>
      <pre className="mb-4 whitespace-pre-wrap break-words">
        {stringifyData(entry[0])}
      </pre>
    </div>
  );
};

export const SetEntry = ({
  className,
  entry,
}: {
  className?: string;
  entry: unknown;
}) => {
  return (
    <div
      className={`border-base rounded-xl border-[1px] border-solid px-4 ${className ?? ''}`}
    >
      <pre className="my-4 whitespace-pre-wrap break-words">
        {stringifyData(entry)}
      </pre>
    </div>
  );
};
