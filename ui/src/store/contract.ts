import { create } from 'zustand';

interface ContractState {
  instance?: unknown;
  brands?: Record<string, unknown>;
  proposals?: {
    id: string;
    title: { title: string; details: string };
    description: string;
  }[];
}

export const useContractStore = create<ContractState>(() => ({}));
