/**
 * This file serves as the Dependency Injection (DI) container configuration for the application.
 * In Clean Architecture, the DI container is a crucial infrastructure component that manages
 * dependencies between different layers while maintaining their independence.
 * 
 * The container registers and resolves dependencies for:
 * - Infrastructure services (monitoring, database)
 * - Application services
 * - Use cases/interactors
 * - Repositories
 * 
 * This centralized DI setup ensures:
 * 1. Proper dependency inversion (high-level modules don't depend on low-level modules)
 * 2. Loose coupling between components
 * 3. Easier testing through dependency substitution
 * 4. Single source of truth for application-wide dependencies
 */

import { createContainer } from '@evyweb/ioctopus';

import { DI_RETURN_TYPES, DI_SYMBOLS } from '@/di/types';

import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

import { registerMonitoringModule } from '@/di/modules/monitoring.module';
import { registerAuthenticationModule } from '@/di/modules/authentication.module';
import { registerTransactionManagerModule } from '@/di/modules/database.module';
import { registerTodosModule } from '@/di/modules/todos.module';
import { registerUsersModule } from '@/di/modules/users.module';

const ApplicationContainer = createContainer();

registerMonitoringModule(ApplicationContainer);
registerTransactionManagerModule(ApplicationContainer);
registerAuthenticationModule(ApplicationContainer);
registerUsersModule(ApplicationContainer);
registerTodosModule(ApplicationContainer);

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
  symbol: K
): DI_RETURN_TYPES[K] {
  const instrumentationService =
    ApplicationContainer.get<IInstrumentationService>(
      DI_SYMBOLS.IInstrumentationService
    );

  return instrumentationService.startSpan(
    {
      name: '(di) getInjection',
      op: 'function',
      attributes: { symbol: symbol.toString() },
    },
    () => ApplicationContainer.get(DI_SYMBOLS[symbol])
  );
}
