'use client';

import type { ComponentProps } from 'react';

import { Tooltip as TooltipPrimitive } from 'radix-ui';

import { cn } from '@Libs/utils';

// The provider is bundled into each tooltip (as in current shadcn/ui) so no app-level provider
// is needed.
export const Tooltip = (props: ComponentProps<typeof TooltipPrimitive.Root>) => (
  <TooltipPrimitive.Provider delayDuration={0}>
    <TooltipPrimitive.Root data-slot="tooltip" {...props} />
  </TooltipPrimitive.Provider>
);

export const TooltipTrigger = (props: ComponentProps<typeof TooltipPrimitive.Trigger>) => (
  <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
);

export const TooltipContent = (props: ComponentProps<typeof TooltipPrimitive.Content>) => {
  const { children, className, sideOffset = 6, ...rest } = props;

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className={cn(
          'z-50 w-fit rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          className,
        )}
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        {...rest}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
};
