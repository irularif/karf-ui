import type { IconType } from '../Icon';
export declare const registerIcon: (id: string, customIcon: any) => void;
export declare const getIconType: (type?: IconType) => any;
export declare const getIconStyle: (type: string | undefined, extraProps: any) => {
    solid?: undefined;
    brand?: undefined;
} | {
    solid: any;
    brand: any;
};
