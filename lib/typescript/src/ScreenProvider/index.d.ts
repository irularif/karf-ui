import React from 'react';
import { TDevice } from './context';
export declare const screenConfig: Record<TDevice, number>;
interface ScreenProviderProps {
    children: React.ReactNode;
}
export declare const ScreenProvider: ({ children }: ScreenProviderProps) => JSX.Element;
export {};
