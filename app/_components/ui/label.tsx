'use client';

/**
 * This component is part of the UI layer in our clean architecture implementation.
 * It provides a reusable Label component that wraps Radix UI's label primitive
 * with consistent styling and accessibility features. As part of the presentation layer,
 * it handles only UI concerns and styling, maintaining a clear separation from business
 * logic and data management. The component uses class-variance-authority for style
 * variants and follows the adapter pattern by wrapping the third-party Radix UI component.
 */

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/app/_components/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
