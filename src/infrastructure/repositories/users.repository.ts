/**
 * Users Repository Implementation - Infrastructure Layer
 * 
 * This repository implements the IUsersRepository interface from the application layer,
 * following clean architecture principles. It serves as a concrete implementation
 * in the infrastructure layer, handling the actual data persistence operations.
 * 
 * The repository uses Drizzle ORM for database operations and includes instrumentation
 * and crash reporting capabilities. It acts as an adapter between the domain/application
 * layer and the actual database, ensuring that the inner layers remain independent
 * of the specific database technology being used.
 */

import { eq } from 'drizzle-orm';

import { db } from '@/drizzle';
import { users } from '@/drizzle/schema';
import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { DatabaseOperationError } from '@/src/entities/errors/common';
import { User } from '@/src/entities/models/user';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';

export class UsersRepository implements IUsersRepository {
  constructor(
    private readonly instrumentationService: IInstrumentationService,
    private readonly crashReporterService: ICrashReporterService
  ) { }
  async getUser(id: string): Promise<User | undefined> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > getUser' },
      async () => {
        try {
          const query = db.query.users.findFirst({
            where: eq(users.id, id),
          });

          const user = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          return user;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > getUserByUsername' },
      async () => {
        try {
          const query = db.query.users.findFirst({
            where: eq(users.username, username),
          });

          const user = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          return user;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }
  async createUser(input: User): Promise<User> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > createUser' },
      async () => {
        try {
          const query = db.insert(users).values(input).returning();

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
            throw new DatabaseOperationError('Cannot create user.');
          }
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }
}
