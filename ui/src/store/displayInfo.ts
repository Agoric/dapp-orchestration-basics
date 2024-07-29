import type { PurseJSONState } from '@agoric/react-components';
import type { AssetKind } from '@agoric/web-components';
import { create } from 'zustand';

export type DisplayInfoForBrand = {
  assetKind: PurseJSONState<AssetKind>['displayInfo']['assetKind'];
  decimalPlaces?: number;
  petname: string;
};

interface DisplayInfoState {
  brandToDisplayInfo: Map<unknown, DisplayInfoForBrand>;
  saveDisplayInfo: ({
    brand,
    info,
  }: {
    brand: unknown;
    info: DisplayInfoForBrand;
  }) => void;
  savePurseInfo: (purses: PurseJSONState<AssetKind>[]) => void;
}

export const useDisplayInfo = create<DisplayInfoState>((set, get) => ({
  brandToDisplayInfo: new Map(),
  saveDisplayInfo: ({ brand, info }) => {
    const currentInfo = get().brandToDisplayInfo;
    if (currentInfo.has(brand)) return;

    const newInfo = new Map(currentInfo);
    newInfo.set(brand, info);
    set({ brandToDisplayInfo: newInfo });
  },
  savePurseInfo: purses => {
    const currentInfo = get().brandToDisplayInfo;
    if (purses.every(({ brand }) => currentInfo.has(brand))) return;
    const newInfo = new Map(currentInfo);

    purses.forEach(p => {
      newInfo.set(p.brand, {
        assetKind: p.displayInfo.assetKind,
        decimalPlaces: p.displayInfo.decimalPlaces,
        petname: p.brandPetname,
      });
    });
    set({ brandToDisplayInfo: newInfo });
  },
}));
