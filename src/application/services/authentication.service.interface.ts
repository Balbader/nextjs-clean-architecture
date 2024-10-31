/**
 * Authentication Service Interface - Application Layer
 * 
 * This interface defines the contract for authentication operations in the application layer
 * of the clean architecture. It acts as a boundary between the domain/business logic and
 * the infrastructure layer, ensuring loose coupling and dependency inversion.
 * 
 * The implementation of this interface will reside in the infrastructure layer, while the
 * business logic in the application layer depends on this abstraction, not the concrete
 * implementation, following the Dependency Inversion Principle.
 */

import { Cookie } from '@/src/entities/models/cookie';
import { Session } from '@/src/entities/models/session';
import { User } from '@/src/entities/models/user';

export interface IAuthenticationService {
  generateUserId(): string;
  validateSession(
    sessionId: Session['id']
  ): Promise<{ user: User; session: Session }>;
  createSession(user: User): Promise<{ session: Session; cookie: Cookie }>;
  invalidateSession(sessionId: Session['id']): Promise<{ blankCookie: Cookie }>;
}
