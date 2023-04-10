import { CameraInput, CameraInputProps } from './Camera';
import { DateInput, DateInputProps } from './Date';
import { Dropdown, DropdownProps } from './Dropdown';
import { ImagePicker, ImagePickerProps } from './ImagePicker';
import { Placeholder, PlaceholderProps } from './Placeholder';
import { TextInput, TextInputProps } from './Text';

export const Input = {
  Text: TextInput,
  Date: DateInput,
  Camera: CameraInput,
  ImagePicker: ImagePicker,
  Dropdown: Dropdown,
  Placeholder: Placeholder,
};

export type {
  TextInputProps,
  CameraInputProps,
  DateInputProps,
  DropdownProps,
  ImagePickerProps,
  PlaceholderProps,
};
