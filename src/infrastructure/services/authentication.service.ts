/**
 * Infrastructure Layer - Authentication Service Implementation
 * 
 * This service implements the IAuthenticationService interface from the application layer,
 * providing concrete authentication functionality using the Lucia auth library.
 * 
 * In clean architecture, this class belongs to the infrastructure/outer layer as it:
 * 1. Implements interfaces defined in the application layer
 * 2. Contains external dependencies (Lucia)
 * 3. Handles technical details of authentication that should be isolated from business logic
 * 
 * The service manages user sessions, authentication state, and provides core auth functionality
 * while keeping the implementation details hidden from the application core.
 */

import { generateIdFromEntropySize, Lucia } from 'lucia';

import { SESSION_COOKIE } from '@/config';
import { luciaAdapter } from '@/drizzle';
import { type IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { Cookie } from '@/src/entities/models/cookie';
import { Session, sessionSchema } from '@/src/entities/models/session';
import { User } from '@/src/entities/models/user';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

export class AuthenticationService implements IAuthenticationService {
  private _lucia: Lucia;

  constructor(
    private _usersRepository: IUsersRepository,
    private readonly instrumentationService: IInstrumentationService
  ) {
    this._lucia = new Lucia(luciaAdapter, {
      sessionCookie: {
        name: SESSION_COOKIE,
        expires: false,
        attributes: {
          secure: process.env.NODE_ENV === 'production',
        },
      },
      getUserAttributes: (attributes) => {
        return {
          username: attributes.username,
        };
      },
    });
  }

  async validateSession(
    sessionId: string
  ): Promise<{ user: User; session: Session }> {
    return await this.instrumentationService.startSpan(
      { name: 'AuthenticationService > validateSession' },
      async () => {
        const result = await this.instrumentationService.startSpan(
          { name: 'lucia.validateSession', op: 'function' },
          () => this._lucia.validateSession(sessionId)
        );

        if (!result.user || !result.session) {
          throw new UnauthenticatedError('Unauthenticated');
        }

        const user = await this._usersRepository.getUser(result.user.id);

        if (!user) {
          throw new UnauthenticatedError("User doesn't exist");
        }

        return { user, session: result.session };
      }
    );
  }

  async createSession(
    user: User
  ): Promise<{ session: Session; cookie: Cookie }> {
    return await this.instrumentationService.startSpan(
      { name: 'AuthenticationService > createSession' },
      async () => {
        const luciaSession = await this.instrumentationService.startSpan(
          { name: 'lucia.createSession', op: 'function' },
          () => this._lucia.createSession(user.id, {})
        );

        const session = sessionSchema.parse(luciaSession);
        const cookie = await this.instrumentationService.startSpan(
          { name: 'lucia.createSessionCookie', op: 'function' },
          () => this._lucia.createSessionCookie(session.id)
        );

        return { session, cookie };
      }
    );
  }

  async invalidateSession(sessionId: string): Promise<{ blankCookie: Cookie }> {
    await this.instrumentationService.startSpan(
      { name: 'lucia.invalidateSession', op: 'function' },
      () => this._lucia.invalidateSession(sessionId)
    );

    const blankCookie = await this.instrumentationService.startSpan(
      { name: 'lucia.createBlankSessionCookie', op: 'function' },
      () => this._lucia.createBlankSessionCookie()
    );

    return { blankCookie };
  }

  generateUserId(): string {
    return this.instrumentationService.startSpan(
      { name: 'AuthenticationService > generateUserId', op: 'function' },
      () => generateIdFromEntropySize(10)
    );
  }
}

interface DatabaseUserAttributes {
  username: string;
}

declare module 'lucia' {
  interface Register {
    Lucia: Lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
