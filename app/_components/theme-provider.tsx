'use client';

/**
 * Theme Provider Component - Interface Adapter Layer (Clean Architecture)
 * 
 * This component serves as part of the Interface Adapters layer in Clean Architecture,
 * specifically handling the presentation concern of theming across the application.
 * It wraps the Next-Themes provider to manage theme state and switching functionality,
 * acting as a bridge between the UI framework (presentation layer) and the application's
 * theming requirements.
 * 
 * The 'use client' directive indicates this is a Client Component, handling interactive
 * theme switching on the client side while maintaining consistency with SSR.
 */

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
