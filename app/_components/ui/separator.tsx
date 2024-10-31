'use client';

/**
 * UI Component: Separator
 * 
 * This component is part of the UI layer in our clean architecture implementation.
 * It provides a reusable visual separator (horizontal or vertical line) using Radix UI primitives.
 * As a presentational component, it belongs to the outermost layer of the architecture,
 * handling only UI concerns without any business logic or data management.
 * 
 * The component is built on top of Radix UI's separator primitive for accessibility
 * and consistent behavior across different contexts.
 */

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/app/_components/utils';

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
