/**
 * Mock Authentication Service - Infrastructure Layer
 * 
 * This mock implementation of the IAuthenticationService interface belongs to the infrastructure layer
 * of the clean architecture. It provides a test double for the authentication service, allowing
 * for isolated testing of components that depend on authentication functionality.
 * 
 * The service maintains an in-memory store of sessions and implements all the contract methods
 * defined by the application layer's interface, but in a simplified way suitable for testing.
 * This follows the Dependency Inversion Principle, where high-level modules (application layer)
 * don't depend on low-level implementations, but both depend on abstractions.
 */

import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { User } from '@/src/entities/models/user';
import { Session, sessionSchema } from '@/src/entities/models/session';
import { type IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { Cookie } from '@/src/entities/models/cookie';
import { SESSION_COOKIE } from '@/config';

export class MockAuthenticationService implements IAuthenticationService {
  private _sessions: Record<string, { session: Session; user: User }>;

  constructor(private _usersRepository: IUsersRepository) {
    this._sessions = {};
  }

  async validateSession(
    sessionId: string
  ): Promise<{ user: User; session: Session }> {
    const result = this._sessions[sessionId] ?? { user: null, session: null };

    if (!result.user || !result.session) {
      throw new UnauthenticatedError('Unauthenticated');
    }

    const user = await this._usersRepository.getUser(result.user.id);

    return { user: user!, session: result.session };
  }

  async createSession(
    user: User
  ): Promise<{ session: Session; cookie: Cookie }> {
    const luciaSession: Session = {
      id: 'random_session_id',
      userId: user.id,
      expiresAt: new Date(new Date().getTime() + 86400000 * 7), // 7 days
    };
    const session = sessionSchema.parse(luciaSession);
    const cookie: Cookie = {
      name: SESSION_COOKIE,
      value: session.id + '_' + user.id,
      attributes: {},
    };

    this._sessions[session.id] = { session, user };

    return { session, cookie };
  }

  async invalidateSession(sessionId: string): Promise<{ blankCookie: Cookie }> {
    delete this._sessions[sessionId];
    const blankCookie: Cookie = {
      name: SESSION_COOKIE,
      value: '',
      attributes: {},
    };
    return Promise.resolve({ blankCookie });
  }

  generateUserId(): string {
    return (Math.random() + 1).toString(36).substring(7);
  }
}
