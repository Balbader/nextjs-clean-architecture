'use client';

/**
 * UserMenu Component
 * 
 * This component is part of the presentation layer in clean architecture,
 * specifically within the UI components layer. It handles the user interface
 * for user-related actions like signing out.
 * 
 * As a presentational component, it:
 * - Renders the user avatar and dropdown menu
 * - Handles user interactions (clicking sign out)
 * - Delegates business logic to the appropriate use cases (auth actions)
 * 
 * The component follows the single responsibility principle by focusing solely
 * on the UI representation of the user menu functionality.
 */

import { signOut } from '@/app/(auth)/actions';
import { Avatar, AvatarFallback } from './avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback>👤</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
