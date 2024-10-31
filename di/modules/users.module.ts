/**
 * Users Module - Dependency Injection Configuration
 * 
 * This module is part of the application's dependency injection layer, which sits at
 * the infrastructure/framework level in Clean Architecture. It's responsible for:
 * 
 * 1. Registering and configuring the Users-related dependencies in the IoC container
 * 2. Managing environment-specific implementations (e.g., mock vs real repositories)
 * 3. Wiring up the dependencies required by the Users domain
 * 
 * In Clean Architecture, this configuration ensures that the business logic (use cases)
 * remains independent of external concerns by injecting the appropriate implementations
 * of repository interfaces.
 */

import { Container } from '@evyweb/ioctopus';

import { MockUsersRepository } from '@/src/infrastructure/repositories/users.repository.mock';
import { UsersRepository } from '@/src/infrastructure/repositories/users.repository';

import { DI_SYMBOLS } from '@/di/types';

export function registerUsersModule(container: Container) {
  if (process.env.NODE_ENV === 'test') {
    container.bind(DI_SYMBOLS.IUsersRepository).toClass(MockUsersRepository);
  } else {
    container
      .bind(DI_SYMBOLS.IUsersRepository)
      .toClass(UsersRepository, [
        DI_SYMBOLS.IInstrumentationService,
        DI_SYMBOLS.ICrashReporterService,
      ]);
  }
}
