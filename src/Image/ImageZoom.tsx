import { Dimensions } from 'react-native';
import {
  default as RNImageZoom,
  ImageZoomProps as RNImageZoomProps
} from 'react-native-image-pan-zoom';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';

export interface ImageZoomProps extends Omit<RNImageZoomProps, 'cropWidth' | 'cropHeight'> {
  cropWidth?: number;
  cropHeight?: number;
}

const _ImageZoom: RNFunctionComponent<ImageZoomProps> = ({ cropWidth, cropHeight, ...props }) => {
  const { width, height } = Dimensions.get('screen');

  const _cropWidth = cropWidth || width;
  const _cropHeight = cropHeight || height;

  return <RNImageZoom cropHeight={_cropHeight} cropWidth={_cropWidth} {...props} />;
};

_ImageZoom.displayName = 'Image.Zoom';
export const ImageZoom = withConfig(_ImageZoom);
