import { TopBarBase, TopBarProps } from './TopBar';
import { TopBarTitle, TopBarTitleProps } from './Title';
import { TopBarLeftAction, TopBarLeftActionProps } from './LeftAction';
import { TopBarRightAction, TopBarRightActionProps } from './RightAction';

export const TopBar = Object.assign(TopBarBase, {
  Title: TopBarTitle,
  LeftAction: TopBarLeftAction,
  RightAction: TopBarRightAction,
});

export type { TopBarProps, TopBarTitleProps, TopBarLeftActionProps, TopBarRightActionProps };
