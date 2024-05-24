import type { CopyRecord } from '@endo/pass-style';

// export type {ContractMeta} from '@agoric/zoe/src/contractFacet/types-ambient';
export type ContractMeta = {
  customTermsShape?: CopyRecord<any> | undefined;
  privateArgsShape?: CopyRecord<any> | undefined;
  upgradability?: 'none' | 'canBeUpgraded' | 'canUpgrade' | undefined;
};
