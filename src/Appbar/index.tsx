import { AppbarBase, AppbarProps } from './Appbar';
import { AppbarTitle, AppbarTitleProps } from './Title';
import { AppbarLeftAction, AppbarLeftActionProps } from './LeftAction';
import { AppbarRightAction, AppbarRightActionProps } from './RightAction';

export const Appbar = Object.assign(AppbarBase, {
  Title: AppbarTitle,
  LeftAction: AppbarLeftAction,
  RightAction: AppbarRightAction,
});

export type { AppbarProps, AppbarTitleProps, AppbarLeftActionProps, AppbarRightActionProps };
