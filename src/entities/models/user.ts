import { z } from 'zod';

/**
 * Schema definition for User entity using Zod validation
 * Defines the structure and validation rules for user data
 */
export const userSchema = z.object({
  // Unique identifier for the user
  id: z.string(),

  // Username must be between 3 and 31 characters
  username: z.string().min(3).max(31),

  // Hashed password must be between 6 and 255 characters
  // Stores the hashed version of the user's password, never the plain text
  password_hash: z.string().min(6).max(255),
});

// TypeScript type definition derived from the Zod schema
// This ensures type safety when working with User objects
export type User = z.infer<typeof userSchema>;
