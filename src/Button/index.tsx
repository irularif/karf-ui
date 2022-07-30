import React from 'react';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { Icon, IconProps } from '../Icon';
import { ButtonBase } from './Button';
import { ButtonIcon } from './Icon';
import { Label } from './Label';

const _ButtonLeftIcon: RNFunctionComponent<IconProps> = (props) => <Icon {...props} />;
_ButtonLeftIcon.displayName = 'ButtonLeftIcon';
const ButtonLeftIcon = withConfig(_ButtonLeftIcon);
const _ButtonRightIcon: RNFunctionComponent<IconProps> = (props) => <Icon {...props} />;
_ButtonRightIcon.displayName = 'ButtonRightIcon';
const ButtonRightIcon = withConfig(_ButtonRightIcon);

export const Button = Object.assign(ButtonBase, {
  Icon: ButtonIcon,
  LeftIcon: ButtonLeftIcon,
  RightIcon: ButtonRightIcon,
  Label: Label,
});
