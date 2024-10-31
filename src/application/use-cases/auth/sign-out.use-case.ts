/**
 * Sign Out Use Case - Application Layer
 * 
 * This use case implements the business logic for signing out a user in accordance with Clean Architecture principles.
 * As part of the application layer, it orchestrates the flow between the outer layers (infrastructure/interfaces) 
 * and the domain layer, while maintaining independence from implementation details.
 * 
 * The use case:
 * 1. Coordinates the session invalidation process
 * 2. Utilizes instrumentation for monitoring/tracing
 * 3. Returns a blank cookie to clear the client's session
 * 
 * Dependencies are injected through interfaces, maintaining the Dependency Inversion Principle.
 */

import { Cookie } from '@/src/entities/models/cookie';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

export type ISignOutUseCase = ReturnType<typeof signOutUseCase>;

export const signOutUseCase =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService
  ) =>
    (sessionId: string): Promise<{ blankCookie: Cookie }> => {
      return instrumentationService.startSpan(
        { name: 'signOut Use Case', op: 'function' },
        async () => {
          return await authenticationService.invalidateSession(sessionId);
        }
      );
    };
