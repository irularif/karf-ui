import { CameraInput } from './Camera';
import { DateInput } from './Date';
import { ImagePicker } from './ImagePicker';
import { TextInput, TextInputProps } from './Text';

export const Input = {
  Text: TextInput,
  Date: DateInput,
  Camera: CameraInput,
  ImagePicker: ImagePicker,
};

export type { TextInputProps };
