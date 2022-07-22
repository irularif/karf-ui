import type { ScaledSize } from 'react-native';
import type { TDevice } from '../ScreenProvider/context';
export declare type TDeviceSize = Record<TDevice, number>;
export declare const deviceSizes: TDeviceSize;
export declare const getSize: (screen: ScaledSize) => TDevice;
