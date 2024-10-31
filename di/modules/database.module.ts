/**
 * Database Module - Dependency Injection Configuration
 * 
 * This module is part of the infrastructure layer in Clean Architecture.
 * It handles the registration of database-related dependencies in the IoC container.
 * Following the Dependency Inversion Principle, it binds abstract interfaces to concrete
 * implementations, allowing the application to switch between real and mock implementations
 * based on the environment (e.g., production vs test).
 * 
 * The TransactionManagerService is responsible for managing database transactions,
 * providing a clean separation between the application's business logic and its
 * data persistence mechanisms.
 */

import { Container } from '@evyweb/ioctopus';

import { TransactionManagerService } from '@/src/infrastructure/services/transaction-manager.service';
import { MockTransactionManagerService } from '@/src/infrastructure/services/transaction-manager.service.mock';

import { DI_SYMBOLS } from '@/di/types';

export function registerTransactionManagerModule(container: Container) {
  if (process.env.NODE_ENV === 'test') {
    container
      .bind(DI_SYMBOLS.ITransactionManagerService)
      .toClass(MockTransactionManagerService);
  } else {
    container
      .bind(DI_SYMBOLS.ITransactionManagerService)
      .toClass(TransactionManagerService);
  }
}
