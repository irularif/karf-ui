import type { ReactElement } from 'react';
import { renderNode, RNFunctionComponent } from '../helpers';
import withConfig from '../helpers/withConfig';
import { Text } from '../Text';

export interface PopoverTriggerProps {
  children: ReactElement;
}

const _Trigger: RNFunctionComponent<PopoverTriggerProps> = ({ children }) => {
  return (
    <>
      {typeof children === 'string' ? renderNode(Text, children, {}) : renderNode(children, true)}
    </>
  );
};

_Trigger.displayName = 'Popover.Trigger';
export const PopoverTrigger = withConfig(_Trigger);
