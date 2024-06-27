import { useAgoric } from '@agoric/react-components';

export const usePurse = (brandPetname: string) => {
  const { purses } = useAgoric();

  return purses?.find(p => p.brandPetname === brandPetname);
};
