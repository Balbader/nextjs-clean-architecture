/**
 * Sign Up Use Case - Application Layer
 * 
 * This use case implements the business logic for user registration in accordance with Clean Architecture principles.
 * As part of the application layer, it orchestrates the flow between the outer layers (infrastructure/interfaces) 
 * and the domain layer, while encapsulating the core business rules for user registration.
 * 
 * It coordinates:
 * - Input validation and business rules
 * - Password hashing
 * - User creation
 * - Session management
 * 
 * Dependencies are injected through interfaces, maintaining the Dependency Inversion Principle
 * and keeping the use case independent of specific implementations.
 */

import { hash } from 'bcrypt-ts';

import { AuthenticationError } from '@/src/entities/errors/auth';
import { Cookie } from '@/src/entities/models/cookie';
import { Session } from '@/src/entities/models/session';
import { User } from '@/src/entities/models/user';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { PASSWORD_SALT_ROUNDS } from '@/config';

export type ISignUpUseCase = ReturnType<typeof signUpUseCase>;

export const signUpUseCase =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    usersRepository: IUsersRepository
  ) =>
    (input: {
      username: string;
      password: string;
    }): Promise<{
      session: Session;
      cookie: Cookie;
      user: Pick<User, 'id' | 'username'>;
    }> => {
      return instrumentationService.startSpan(
        { name: 'signUp Use Case', op: 'function' },
        async () => {
          const existingUser = await usersRepository.getUserByUsername(
            input.username
          );
          if (existingUser) {
            throw new AuthenticationError('Username taken');
          }

          const passwordHash = await instrumentationService.startSpan(
            { name: 'hash password', op: 'function' },
            () => hash(input.password, PASSWORD_SALT_ROUNDS)
          );

          const userId = authenticationService.generateUserId();

          const newUser = await usersRepository.createUser({
            id: userId,
            username: input.username,
            password_hash: passwordHash,
          });

          const { cookie, session } =
            await authenticationService.createSession(newUser);

          return {
            cookie,
            session,
            user: {
              id: newUser.id,
              username: newUser.username,
            },
          };
        }
      );
    };
