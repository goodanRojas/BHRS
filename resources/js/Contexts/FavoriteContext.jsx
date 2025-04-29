// contexts/FavoriteContext.js
import { createContext, useContext } from 'react';

export const FavoriteContext = createContext();

export const useFavorite = () => useContext(FavoriteContext);
