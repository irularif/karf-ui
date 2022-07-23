import React from 'react';
import type { RNFunctionComponent } from '../helpers';
import { Icon, IconProps } from '../Icon';
import { ButtonBase } from './Button';

const ButtonLeftIcon: RNFunctionComponent<IconProps> = (props) => <Icon {...props} />;
ButtonLeftIcon.displayName = 'ButtonLeftIcon';
const ButtonRightIcon: RNFunctionComponent<IconProps> = (props) => <Icon {...props} />;
ButtonRightIcon.displayName = 'ButtonRightIcon';

export const Button = Object.assign(ButtonBase, {
  Icon: ButtonLeftIcon,
  LeftIcon: ButtonLeftIcon,
  RightIcon: ButtonRightIcon,
});
