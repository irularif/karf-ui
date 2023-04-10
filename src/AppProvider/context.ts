import React from 'react';
import type { TAppContext, TAppDispatchContext } from '../../types/app';

export const AppContext = React.createContext<TAppContext | undefined>(undefined);
export const AppDispatchContext = React.createContext<TAppDispatchContext | undefined>(undefined);
