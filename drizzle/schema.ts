/**
 * Database Schema Definition - Infrastructure Layer
 * 
 * This file represents the lowest layer in Clean Architecture - the Infrastructure/Frameworks layer.
 * It defines the database schema using Drizzle ORM, acting as the data persistence boundary.
 * These table definitions serve as the foundation for our data storage, but are kept separate
 * from the business logic (use cases) and domain entities to maintain separation of concerns.
 * 
 * The schema includes:
 * - users: Authentication and user management
 * - sessions: User session handling
 * - todos: The main business entity for todo items
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  password_hash: text('password_hash').notNull(),
});

export const sessions = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: integer('expires_at').notNull(),
});

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey(),
  todo: text('todo').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
});
