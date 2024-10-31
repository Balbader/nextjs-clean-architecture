/**
 * This component represents a UI-level input element following Clean Architecture principles.
 * It belongs to the Interface Adapters / Presentation layer, specifically in the UI components section.
 * The Input component is a reusable, styled form control that adapts the raw HTML input element
 * to match our application's design system while maintaining accessibility and native functionality.
 * It uses composition and forwarded refs to remain flexible and maintainable.
 */

import * as React from 'react';

import { cn } from '@/app/_components/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
