import { PopoverContent, PopoverContentProps } from './Content';
import { BasePopover, PopoverProps } from './Popover';
import { PopoverTrigger, PopoverTriggerProps } from './Trigger';

export const Popover = Object.assign(BasePopover, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
});

export type { PopoverProps, PopoverContentProps, PopoverTriggerProps };
