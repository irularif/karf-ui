import { Icon } from '../Icon';
import { ButtonBase } from './Button';

const ButtonLeftIcon = Icon;
ButtonLeftIcon.displayName = 'ButtonLeftIcon';
const ButtonRightIcon = Icon;
ButtonRightIcon.displayName = 'ButtonRightIcon';

export const Button = Object.assign(ButtonBase, {
  LeftIcon: ButtonLeftIcon,
  RightIcon: ButtonRightIcon,
});
