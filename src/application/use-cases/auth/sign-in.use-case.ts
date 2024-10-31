/**
 * Sign In Use Case - Application Layer
 * 
 * This use case implements the business logic for user authentication in accordance with Clean Architecture principles.
 * As part of the application layer, it orchestrates the flow between the outer layers (infrastructure/interfaces) 
 * and the domain layer, while maintaining independence from implementation details.
 * 
 * It coordinates:
 * - User repository access for credential verification
 * - Password comparison using bcrypt
 * - Session creation through the authentication service
 * - Instrumentation for monitoring and tracing
 * 
 * The use case remains framework-agnostic and focuses purely on the business rules of user authentication.
 */

import { compare } from 'bcrypt-ts';

import { AuthenticationError } from '@/src/entities/errors/auth';
import { Cookie } from '@/src/entities/models/cookie';
import { Session } from '@/src/entities/models/session';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

export type ISignInUseCase = ReturnType<typeof signInUseCase>;

export const signInUseCase =
  (
    instrumentationService: IInstrumentationService,
    usersRepository: IUsersRepository,
    authenticationService: IAuthenticationService
  ) =>
    (input: {
      username: string;
      password: string;
    }): Promise<{ session: Session; cookie: Cookie }> => {
      return instrumentationService.startSpan(
        { name: 'signIn Use Case', op: 'function' },
        async () => {
          const existingUser = await usersRepository.getUserByUsername(
            input.username
          );

          if (!existingUser) {
            throw new AuthenticationError('User does not exist');
          }

          const validPassword = await instrumentationService.startSpan(
            { name: 'verify password hash', op: 'function' },
            () => compare(input.password, existingUser.password_hash)
          );

          if (!validPassword) {
            throw new AuthenticationError('Incorrect username or password');
          }

          return await authenticationService.createSession(existingUser);
        }
      );
    };
