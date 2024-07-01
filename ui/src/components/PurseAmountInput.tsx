import { AmountInput, type PurseJSONState } from '@agoric/react-components';
import type { Amount, AssetKind } from '@agoric/web-components';
import { useState } from 'react';
import { CopyBagEntry, PurseValue, SetEntry } from './DisplayAmount';
import { stringifyData } from '../utils/stringify';
import { makeCopyBag } from '@endo/patterns';

type Props = {
  purse: PurseJSONState<AssetKind>;
  onChange: (amount: Amount | null) => void;
};

const PurseAmountInput = (props: Props) => {
  const { assetKind } = props.purse.displayInfo;

  if (assetKind === 'nat') {
    return <NatAmountInput {...props} />;
  }
  if (assetKind === 'copyBag') {
    return (
      <>
        <div className="daisyui-divider"></div>
        <CopyBagInput {...props} />
      </>
    );
  }
  if (assetKind === 'set') {
    return (
      <>
        <div className="daisyui-divider"></div>
        <SetInput {...props} />
      </>
    );
  }
  return <></>;
};

const SetInput = ({ purse, onChange }: Props) => {
  const entries = purse.currentAmount.value;
  const [checkedEntries, setCheckedEntries] = useState(new Set<unknown>());

  const updateSelection = (entry: unknown, isChecked: boolean) => {
    const updated = new Set(checkedEntries);

    if (!isChecked) {
      updated.delete(entry);
    } else {
      updated.add(entry);
    }
    if (!updated.size) {
      onChange(null);
    } else {
      const newAmount = {
        brand: purse.brand,
        value: [...updated],
      };
      onChange(newAmount);
    }
    setCheckedEntries(updated);
  };

  return entries.map((entry: unknown) => {
    const isChecked = checkedEntries.has(entry);

    const onChange = () => {
      updateSelection(entry, !isChecked);
    };

    return (
      <div key={stringifyData(entry)}>
        <div className="mt-6 flex max-w-full  flex-row items-start justify-between gap-8">
          <SetEntry className="grow" entry={entry} />
          <div>
            <input
              checked={isChecked}
              onChange={onChange}
              type="checkbox"
              className="daisyui-checkbox-primary daisyui-checkbox"
            />
          </div>
        </div>
        <div className="daisyui-divider"></div>
      </div>
    );
  });
};

const CopyBagInput = ({ purse, onChange }: Props) => {
  const entries = purse.currentAmount.value.payload;
  const [entriesMap, setEntriesMap] = useState(
    new Map<string, [unknown, bigint]>(),
  );

  const updateCount = (entry: [unknown, bigint], count: bigint) => {
    const updated = new Map(entriesMap);
    if (count === 0n) {
      updated.delete(stringifyData(entry[0]));
    } else {
      updated.set(stringifyData(entry[0]), [entry[0], count]);
    }
    if (count > entry[1]) {
      onChange(null);
    } else {
      const newAmount = {
        brand: purse.brand,
        value: makeCopyBag(updated.values()),
      };
      onChange(newAmount);
    }
    setEntriesMap(updated);
  };

  return entries.map((entry: [unknown, bigint]) => {
    const selectedAmount = entriesMap.get(stringifyData(entry[0]))?.[1] ?? null;

    const onInput = (count: bigint) => {
      updateCount(entry, count);
    };

    const isError = selectedAmount && selectedAmount > entry[1];

    return (
      <div key={stringifyData(entry[0])}>
        <div className="mt-6 flex flex-row items-start justify-between gap-8">
          <CopyBagEntry className="grow" entry={entry} />
          <div>
            <div
              className={`mb-1 text-sm font-medium ${isError ? 'text-error' : ''}`}
            >
              Amount
            </div>
            <AmountInput
              className="daisyui-input daisyui-input-lg daisyui-input-primary max-h-12 max-w-20 p-2"
              decimalPlaces={0}
              value={selectedAmount}
              onChange={onInput}
            />
          </div>
        </div>
        <div className="daisyui-divider"></div>
      </div>
    );
  });
};

const NatAmountInput = ({ purse, onChange }: Props) => {
  const [amount, setAmount] = useState({ brand: purse?.brand, value: 0n });
  const hasError = amount.value > purse.currentAmount.value;

  const onInputChange = (value: bigint) => {
    const newAmount = { brand: purse?.brand, value };
    if (value > purse.currentAmount.value || value === 0n) {
      onChange(null);
    } else {
      onChange(newAmount);
    }
    setAmount(newAmount);
  };

  return (
    <div className="mt-4">
      <label className="daisyui-input daisyui-input-bordered flex items-center gap-2">
        <AmountInput
          onChange={onInputChange}
          decimalPlaces={purse.displayInfo.decimalPlaces ?? 0}
          value={amount.value || null}
        />
      </label>
      <div className={`p-1 ${hasError ? 'text-error' : ''}`}>
        Balance: <PurseValue purse={purse} />
      </div>
    </div>
  );
};

export default PurseAmountInput;
