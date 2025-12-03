import { createContext, useContext } from 'react';

export const SupportCountContext = createContext();

export const useSupportCount = () => useContext(SupportCountContext);
