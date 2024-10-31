/**
 * This file defines the core Todo entity model as part of the Clean Architecture pattern.
 * In Clean Architecture, entities represent the enterprise business rules and contain
 * the most high-level and abstract business rules. They are the least likely to change
 * when something external changes.
 * 
 * The Todo entity is defined using Zod schemas for runtime type validation and TypeScript
 * type inference. This ensures type safety both at compile time and runtime while
 * maintaining a single source of truth for the Todo data structure.
 */

import { z } from 'zod';

export const selectTodoSchema = z.object({
  id: z.number(),
  todo: z.string(),
  completed: z.boolean(),
  userId: z.string(),
});
export type Todo = z.infer<typeof selectTodoSchema>;

export const insertTodoSchema = selectTodoSchema.pick({
  todo: true,
  userId: true,
  completed: true,
});

export type TodoInsert = z.infer<typeof insertTodoSchema>;
