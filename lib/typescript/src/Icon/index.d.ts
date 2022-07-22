import { StyleProp, ViewStyle } from 'react-native';
import type { RNFunctionComponent } from '../helpers';
export declare type IconType = 'material' | 'material-community' | 'simple-line-icon' | 'zocial' | 'font-awesome' | 'octicon' | 'ionicon' | 'foundation' | 'evilicon' | 'entypo' | 'antdesign' | 'font-awesome-5' | string;
export interface IconProps {
    type?: IconType;
    name: string;
    color?: string;
    size?: number;
    solid?: boolean;
    brand?: boolean;
    style?: StyleProp<ViewStyle>;
}
export declare const Icon: RNFunctionComponent<IconProps>;
