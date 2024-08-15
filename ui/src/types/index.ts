export interface CopyBag<T = string> {
  payload: Array<[T, bigint]>;
}

export interface Purse {
  brand: unknown;
  brandPetname: string;
  currentAmount: {
    brand: unknown;
    value: bigint | CopyBag;
  };
  displayInfo: {
    decimalPlaces: number;
    assetKind: unknown;
  };
}

import { Window as KeplrWindow } from '@keplr-wallet/types';

declare global {
  interface Window extends KeplrWindow {}
}
