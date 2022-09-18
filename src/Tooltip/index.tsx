import type { ReactElement } from 'react';
import type { RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { Popover, PopoverProps } from '../Popover';

export interface TooltipProps extends Omit<PopoverProps, 'children'> {
  content: string | ReactElement;
  children: ReactElement;
}

const _Tooltip: RNFunctionComponent<TooltipProps> = ({ content, children, ...props }) => {
  return (
    // @ts-ignore
    <Popover {...props}>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content>{content}</Popover.Content>
    </Popover>
  );
};

_Tooltip.displayName = 'Tooltip';
export const Tooltip = withConfig(_Tooltip);
