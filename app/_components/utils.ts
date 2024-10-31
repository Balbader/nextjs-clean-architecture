/**
 * Utility Module - Clean Architecture Infrastructure Layer
 * 
 * This module provides core utility functions that support the presentation layer
 * while maintaining clean architecture principles. It acts as part of the infrastructure
 * layer, providing technical capabilities without containing any business logic.
 * 
 * The main utility here combines Tailwind CSS classes efficiently using clsx for
 * conditional class joining and tailwind-merge for deduplication and proper class
 * overrides, ensuring optimal CSS class handling in the presentation layer.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
