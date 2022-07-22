import { IConfigSize, TDevice } from '../ScreenProvider/context';
declare const useScreen: () => {
    select: (params: IConfigSize) => any;
    orientation: import("../ScreenProvider/context").TOrientation;
    size: TDevice;
    scaleSize: import("react-native").ScaledSize;
};
export default useScreen;
