import { create } from 'zustand';

interface ContractState {
  instance?: unknown;
  brands?: Record<string, unknown>;
  proposals?: unknown[];
}

export const useContractStore = create<ContractState>(() => ({}));
