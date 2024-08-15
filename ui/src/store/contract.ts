import { create } from 'zustand';

interface ContractState {
  instances?: Record<string, unknown>;
  brands?: Record<string, unknown>;
  icas?: string[];
}

export const useContractStore = create<ContractState>(() => ({}));
