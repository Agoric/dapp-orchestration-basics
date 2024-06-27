import { AgoricChainStoragePathKind } from '@agoric/rpc';
import type { ChainStorageWatcher } from '@agoric/web-components/dist/src/wallet-connection/walletConnection';
import type { PurseJSONState } from '@agoric/react-components';
import type { AssetKind } from '@agoric/web-components';

export const queryPurses = async (
  chainStorageWatcher: ChainStorageWatcher,
  address: string,
) => {
  const [wallet, bank, vbankAssets, agoricBrands] = await Promise.all([
    chainStorageWatcher.queryOnce([
      AgoricChainStoragePathKind.Data,
      `published.wallet.${address}.current`,
    ]),
    fetch(
      `${chainStorageWatcher.apiAddr}/cosmos/bank/v1beta1/balances/${address}?pagination.limit=1000`,
    ).then(res => res.json()),
    queryVbank(chainStorageWatcher),
    queryBrands(chainStorageWatcher),
  ]);

  const bankBrandsToPurses = generateBankPurses(vbankAssets, bank);
  const nonBankBrandToPurses = await generateNonBankPurses(
    chainStorageWatcher,
    agoricBrands,
    wallet,
  );

  return [
    ...new Map([...bankBrandsToPurses, ...nonBankBrandToPurses]).values(),
  ];
};

const queryVbank = async (chainStorageWatcher: ChainStorageWatcher) =>
  chainStorageWatcher.queryOnce([
    AgoricChainStoragePathKind.Data,
    'published.agoricNames.vbankAsset',
  ]);

const queryBrands = async (chainStorageWatcher: ChainStorageWatcher) =>
  chainStorageWatcher.queryOnce<[string, unknown][]>([
    AgoricChainStoragePathKind.Data,
    'published.agoricNames.brand',
  ]);

const generateNonBankPurses = async (
  chainStorageWatcher: ChainStorageWatcher,
  agoricBrands: [string, unknown][],
  wallet: unknown,
) => {
  // @ts-expect-error cast
  const { purses: nonBankPurses } = wallet;

  // @ts-expect-error cast
  const brands = nonBankPurses.map(p => p.brand);

  const boardAux = await Promise.all(chainStorageWatcher.queryBoardAux(brands));
  const brandToBoardAux = new Map<unknown, { displayInfo: unknown }>(
    // @ts-expect-error cast
    brands.map((brand, index) => [brand, boardAux[index]]),
  );

  const brandToPurse = new Map<unknown, PurseJSONState<AssetKind>>();
  // @ts-expect-error cast
  nonBankPurses.forEach(({ balance, brand }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const petname = agoricBrands?.find(([_petname, b]) => b === brand)?.at(0);
    const { displayInfo } = brandToBoardAux.get(brand) ?? {};
    const purseInfo = {
      brand,
      currentAmount: balance,
      brandPetname: petname,
      pursePetname: petname,
      displayInfo,
    };
    // @ts-expect-error cast
    brandToPurse.set(brand, purseInfo);
  });

  return brandToPurse;
};

const generateBankPurses = (vbankAssets: unknown, bank: unknown) => {
  const brandToPurse = new Map<unknown, PurseJSONState<AssetKind>>();
  const bankMap = new Map(
    // @ts-expect-error cast
    bank.balances.map(({ denom, amount }) => [denom, amount]),
  ) as Map<string, bigint>;

  // @ts-expect-error cast
  vbankAssets.forEach(([denom, info]) => {
    const value = BigInt(bankMap.get(denom) ?? 0n);

    const purseInfo = {
      brand: info.brand,
      currentAmount: { brand: info.brand, value },
      brandPetname: info.issuerName,
      pursePetname: info.issuerName,
      displayInfo: info.displayInfo,
    };
    brandToPurse.set(info.brand, purseInfo);
  });

  return brandToPurse;
};
