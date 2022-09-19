import type { ReactElement } from 'react';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';

export interface PopoverContentProps {
  children: string | ReactElement;
}

const _Content: RNFunctionComponent<PopoverContentProps> = ({ children }) => {
  return <>{children}</>;
};

_Content.displayName = 'Popover.Content';
export const PopoverContent = withConfig(_Content);
