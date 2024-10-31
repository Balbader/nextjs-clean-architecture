/**
 * This file defines the Session entity model as part of the Clean Architecture pattern.
 * In Clean Architecture, entities represent the core business objects and contain
 * the most basic and high-level rules of the application. The Session entity
 * encapsulates the essential properties of a user session (id, userId, expiration)
 * and its validation rules using Zod schema. This model is independent of any
 * framework or external agency, making it the most stable and least likely to change
 * due to external factors.
 */

import { z } from 'zod';

export const sessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  expiresAt: z.date(),
});

export type Session = z.infer<typeof sessionSchema>;
