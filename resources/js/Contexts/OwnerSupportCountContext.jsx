import { createContext, useContext } from 'react';

export const OwnerSupportCountContext = createContext();

export const useOwnerSupportCount = () => useContext(OwnerSupportCountContext);
