/**
 * Authentication Module - Dependency Injection Configuration
 * 
 * This module is part of the Clean Architecture's configuration layer, specifically handling
 * dependency injection for the authentication domain. It wires together the different layers
 * of the application:
 * 
 * - Interface Adapters (Controllers) - Outermost layer, handles HTTP/API concerns
 * - Application Layer (Use Cases) - Business logic orchestration
 * - Infrastructure Layer (Services) - Technical implementations
 * 
 * It follows the Dependency Inversion Principle in several ways:
 * 1. All dependencies are defined by interfaces (e.g., IAuthenticationService)
 * 2. Concrete implementations (AuthenticationService) depend on abstractions
 * 3. High-level modules (UseCases) don't depend on low-level modules (Services)
 * 4. Both high and low-level modules depend on abstractions
 * 
 * Example flow:
 * SignInController -> SignInUseCase -> IAuthenticationService
 * Where each arrow represents a dependency on an interface, not a concrete class.
 * 
 * This structure allows for:
 * - Easy swapping of implementations (e.g., MockAuthenticationService for testing)
 * - Independent evolution of layers
 * - Better testability through dependency injection
 */

import { Container } from '@evyweb/ioctopus';

import { AuthenticationService } from '@/src/infrastructure/services/authentication.service';
import { MockAuthenticationService } from '@/src/infrastructure/services/authentication.service.mock';

import { signInUseCase } from '@/src/application/use-cases/auth/sign-in.use-case';
import { signUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';
import { signOutUseCase } from '@/src/application/use-cases/auth/sign-out.use-case';

import { signInController } from '@/src/interface-adapters/controllers/auth/sign-in.controller';
import { signOutController } from '@/src/interface-adapters/controllers/auth/sign-out.controller';
import { signUpController } from '@/src/interface-adapters/controllers/auth/sign-up.controller';

import { DI_SYMBOLS } from '@/di/types';

/**
 * Registers all authentication-related dependencies in the IoC container.
 * This includes services, use cases, and controllers for authentication flows.
 * 
 * @param container - The IoC container instance to register dependencies in
 */
export function registerAuthenticationModule(container: Container) {
  // Bind the appropriate authentication service implementation based on environment
  // Use mock service for tests, real service for other environments
  if (process.env.NODE_ENV === 'test') {
    container
      .bind(DI_SYMBOLS.IAuthenticationService)
      .toClass(MockAuthenticationService, [DI_SYMBOLS.IUsersRepository]);
  } else {
    container
      .bind(DI_SYMBOLS.IAuthenticationService)
      .toClass(AuthenticationService, [
        DI_SYMBOLS.IUsersRepository,
        DI_SYMBOLS.IInstrumentationService,
      ]);
  }

  // Register use cases (application layer)
  // Each use case is registered as a higher-order function with its required dependencies

  // Sign In use case - handles user authentication
  container
    .bind(DI_SYMBOLS.ISignInUseCase)
    .toHigherOrderFunction(signInUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IUsersRepository,
      DI_SYMBOLS.IAuthenticationService,
    ]);

  // Sign Out use case - handles user logout
  container
    .bind(DI_SYMBOLS.ISignOutUseCase)
    .toHigherOrderFunction(signOutUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
    ]);

  // Sign Up use case - handles new user registration
  container
    .bind(DI_SYMBOLS.ISignUpUseCase)
    .toHigherOrderFunction(signUpUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.IUsersRepository,
    ]);

  // Register controllers (interface adapters layer)
  // Controllers handle HTTP requests and delegate to use cases

  // Sign In controller - handles login requests
  container
    .bind(DI_SYMBOLS.ISignInController)
    .toHigherOrderFunction(signInController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.ISignInUseCase,
    ]);

  // Sign Out controller - handles logout requests
  container
    .bind(DI_SYMBOLS.ISignOutController)
    .toHigherOrderFunction(signOutController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ISignOutUseCase,
    ]);

  // Sign Up controller - handles registration requests
  container
    .bind(DI_SYMBOLS.ISignUpController)
    .toHigherOrderFunction(signUpController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.ISignUpUseCase,
    ]);
}
