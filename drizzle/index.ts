/**
 * Database Configuration and Adapters (Infrastructure Layer)
 * 
 * This file serves as part of the infrastructure layer in clean architecture.
 * It handles the database configuration, connection setup, and provides the necessary
 * adapters and types for the application. It acts as a bridge between the database
 * and the rest of the application, ensuring that database-specific implementation
 * details are isolated from the business logic.
 * 
 * The file sets up:
 * 1. Database connection using LibSQL
 * 2. Drizzle ORM configuration
 * 3. Lucia authentication adapter
 * 4. Transaction types for repositories
 */

import { createClient, ResultSet } from '@libsql/client';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { SQLiteTransaction } from 'drizzle-orm/sqlite-core';

import { sessions, todos, users } from './schema';

// Setup sqlite database connection
const client = createClient({
  url: process.env.DATABASE_URL ?? 'file:sqlite.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
});
export const db = drizzle(client, { schema: { users, sessions, todos } });

// Setup lucia adapter
export const luciaAdapter = new DrizzleSQLiteAdapter(db, sessions, users);

// Export Transaction type to be used in repositories
type Schema = {
  users: typeof users;
  sessions: typeof sessions;
  todos: typeof todos;
};
export type Transaction = SQLiteTransaction<
  'async',
  ResultSet,
  Schema,
  ExtractTablesWithRelations<Schema>
>;
