import {
    default as RNImageZoom,
    ImageZoomProps as RNImageZoomProps
} from 'react-native-image-pan-zoom';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';

export interface ImageZoomProps extends RNImageZoomProps {
}

const _ImageZoom: RNFunctionComponent<ImageZoomProps> = ({ ...props }) => {
  return <RNImageZoom {...props} />;
};

_ImageZoom.displayName = 'Image.Zoom';
export const ImageZoom = withConfig(_ImageZoom);
