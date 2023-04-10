import { DropdownBase, DropdownProps } from './Dropdown';
import { DropdownLabel, DropdownLabelProps } from './Label';

export const Dropdown = Object.assign(DropdownBase, {
  Label: DropdownLabel,
});

export type { DropdownProps, DropdownLabelProps };
