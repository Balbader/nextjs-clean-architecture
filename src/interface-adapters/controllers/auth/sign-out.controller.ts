/**
 * Sign Out Controller - Interface Adapter Layer (Clean Architecture)
 * 
 * This controller acts as an interface adapter in the clean architecture pattern,
 * converting and mapping data between the outer layers (like web/API) and the inner
 * application layer. It handles the sign-out operation by:
 * 1. Validating the input session ID
 * 2. Converting the raw session ID into domain objects
 * 3. Coordinating with the authentication service and use case
 * 4. Returning the appropriate cookie response
 * 
 * The controller maintains the dependency rule of clean architecture by depending only
 * on inner layer abstractions (use cases and service interfaces).
 */

import { ISignOutUseCase } from '@/src/application/use-cases/auth/sign-out.use-case';
import { Cookie } from '@/src/entities/models/cookie';
import { InputParseError } from '@/src/entities/errors/common';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

export type ISignOutController = ReturnType<typeof signOutController>;

export const signOutController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    signOutUseCase: ISignOutUseCase
  ) =>
    async (sessionId: string | undefined): Promise<Cookie> => {
      return await instrumentationService.startSpan(
        { name: 'signOut Controller' },
        async () => {
          if (!sessionId) {
            throw new InputParseError('Must provide a session ID');
          }
          const { session } =
            await authenticationService.validateSession(sessionId);

          const { blankCookie } = await signOutUseCase(session.id);
          return blankCookie;
        }
      );
    };
