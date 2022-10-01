import React from 'react';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { Icon, IconProps } from '../Icon';
import { ButtonBase, ButtonProps } from './Button';
import { ButtonIcon as _ButtonIcon, ButtonIconProps } from './Icon';
import { Label, ButtonLabelProps } from './Label';

const _ButtonLeftIcon: RNFunctionComponent<IconProps> = (props) => <Icon {...props} />;
_ButtonLeftIcon.displayName = 'Button.LeftIcon';
const ButtonLeftIcon = withConfig(_ButtonLeftIcon);
const _ButtonRightIcon: RNFunctionComponent<IconProps> = (props) => <Icon {...props} />;
_ButtonRightIcon.displayName = 'Button.RightIcon';
const ButtonRightIcon = withConfig(_ButtonRightIcon);

export const Button = Object.assign(ButtonBase, {
  // Icon: ButtonIcon,
  LeftIcon: ButtonLeftIcon,
  RightIcon: ButtonRightIcon,
  Label: Label,
});

export const ButtonIcon = _ButtonIcon;

export type { ButtonProps, ButtonLabelProps, IconProps, ButtonIconProps };
