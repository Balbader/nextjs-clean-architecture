/**
 * TodosRepository: Infrastructure Layer Implementation
 * 
 * This repository implements the ITodosRepository interface from the application layer,
 * following clean architecture principles. It serves as a concrete implementation
 * in the infrastructure layer, handling the actual data persistence operations.
 * 
 * The repository uses Drizzle ORM for database operations and includes instrumentation
 * for monitoring and error reporting. It maintains the separation of concerns by:
 * - Implementing interfaces defined in the application layer
 * - Handling database-specific logic and error handling
 * - Converting between database models and domain entities
 * 
 * This implementation is independent of business logic (use cases) and can be
 * replaced with different storage implementations without affecting the core business rules.
 */

import { eq } from 'drizzle-orm';

import { db, Transaction } from '@/drizzle';
import { todos } from '@/drizzle/schema';
import { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';
import { DatabaseOperationError } from '@/src/entities/errors/common';
import { TodoInsert, Todo } from '@/src/entities/models/todo';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';

export class TodosRepository implements ITodosRepository {
  constructor(
    private readonly instrumentationService: IInstrumentationService,
    private readonly crashReporterService: ICrashReporterService
  ) { }

  async createTodo(todo: TodoInsert, tx?: Transaction): Promise<Todo> {
    const invoker = tx ?? db;

    return await this.instrumentationService.startSpan(
      { name: 'TodosRepository > createTodo' },
      async () => {
        try {
          const query = invoker.insert(todos).values(todo).returning();

          const [created] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          if (created) {
            return created;
          } else {
            throw new DatabaseOperationError('Cannot create todo');
          }
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }

  async getTodo(id: number): Promise<Todo | undefined> {
    return await this.instrumentationService.startSpan(
      { name: 'TodosRepository > getTodo' },
      async () => {
        try {
          const query = db.query.todos.findFirst({
            where: eq(todos.id, id),
          });

          const todo = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          return todo;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }

  async getTodosForUser(userId: string): Promise<Todo[]> {
    return await this.instrumentationService.startSpan(
      { name: 'TodosRepository > getTodosForUser' },
      async () => {
        try {
          const query = db.query.todos.findMany({
            where: eq(todos.userId, userId),
          });

          const usersTodos = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );
          return usersTodos;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }

  async updateTodo(id: number, input: Partial<TodoInsert>): Promise<Todo> {
    return await this.instrumentationService.startSpan(
      { name: 'TodosRepository > updateTodo' },
      async () => {
        try {
          const query = db
            .update(todos)
            .set(input)
            .where(eq(todos.id, id))
            .returning();

          const [updated] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );
          return updated;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }

  async deleteTodo(id: number, tx?: Transaction): Promise<void> {
    const invoker = tx ?? db;

    await this.instrumentationService.startSpan(
      { name: 'TodosRepository > deleteTodo' },
      async () => {
        try {
          const query = invoker
            .delete(todos)
            .where(eq(todos.id, id))
            .returning();

          await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }
}
