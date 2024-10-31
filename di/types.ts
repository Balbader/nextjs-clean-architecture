/**
 * This file contains dependency injection (DI) type definitions and symbols used throughout the application.
 * It defines two main exports:
 * 1. DI_SYMBOLS: A collection of unique Symbol identifiers for all injectable dependencies
 * 2. DI_RETURN_TYPES: An interface mapping each symbol to its corresponding implementation type
 * 
 * These types and symbols are used by the DI container to manage service instantiation and injection.
 * 
 * Clean Architecture Role:
 * ----------------------
 * This file acts as a cross-cutting concern that supports dependency inversion - one of the key principles
 * of Clean Architecture. It helps maintain the dependency rule by allowing high-level modules (use cases) 
 * to define interfaces that low-level modules (implementations) must conform to. The DI container uses these
 * symbols and types to:
 * - Decouple interface definitions from their implementations
 * - Enable runtime binding of concrete implementations to abstract interfaces
 * - Support the inversion of control principle across all architectural layers
 */

import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';

import { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';
import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';

import { ICreateTodoUseCase } from '@/src/application/use-cases/todos/create-todo.use-case';
import { IDeleteTodoUseCase } from '@/src/application/use-cases/todos/delete-todo.use-case';
import { IGetTodosForUserUseCase } from '@/src/application/use-cases/todos/get-todos-for-user.use-case';
import { IToggleTodoUseCase } from '@/src/application/use-cases/todos/toggle-todo.use-case';
import { ISignInUseCase } from '@/src/application/use-cases/auth/sign-in.use-case';
import { ISignUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';
import { ISignOutUseCase } from '@/src/application/use-cases/auth/sign-out.use-case';

import { ISignInController } from '@/src/interface-adapters/controllers/auth/sign-in.controller';
import { ISignOutController } from '@/src/interface-adapters/controllers/auth/sign-out.controller';
import { ISignUpController } from '@/src/interface-adapters/controllers/auth/sign-up.controller';
import { IBulkUpdateController } from '@/src/interface-adapters/controllers/todos/bulk-update.controller';
import { ICreateTodoController } from '@/src/interface-adapters/controllers/todos/create-todo.controller';
import { IGetTodosForUserController } from '@/src/interface-adapters/controllers/todos/get-todos-for-user.controller';
import { IToggleTodoController } from '@/src/interface-adapters/controllers/todos/toggle-todo.controller';

export const DI_SYMBOLS = {
  // Services
  IAuthenticationService: Symbol.for('IAuthenticationService'),
  ITransactionManagerService: Symbol.for('ITransactionManagerService'),
  IInstrumentationService: Symbol.for('IInstrumentationService'),
  ICrashReporterService: Symbol.for('ICrashReporterService'),

  // Repositories
  ITodosRepository: Symbol.for('ITodosRepository'),
  IUsersRepository: Symbol.for('IUsersRepository'),

  // Use Cases
  ICreateTodoUseCase: Symbol.for('ICreateTodoUseCase'),
  IDeleteTodoUseCase: Symbol.for('IDeleteTodoUseCase'),
  IGetTodosForUserUseCase: Symbol.for('IGetTodosForUserUseCase'),
  IToggleTodoUseCase: Symbol.for('IToggleTodoUseCase'),
  ISignInUseCase: Symbol.for('ISignInUseCase'),
  ISignOutUseCase: Symbol.for('ISignOutUseCase'),
  ISignUpUseCase: Symbol.for('ISignUpUseCase'),

  // Controllers
  ISignInController: Symbol.for('ISignInController'),
  ISignOutController: Symbol.for('ISignOutController'),
  ISignUpController: Symbol.for('ISignUpController'),
  IBulkUpdateController: Symbol.for('IBulkUpdateController'),
  ICreateTodoController: Symbol.for('ICreateTodoController'),
  IGetTodosForUserController: Symbol.for('IGetTodosForUserController'),
  IToggleTodoController: Symbol.for('IToggleTodoController'),
};

export interface DI_RETURN_TYPES {
  // Services
  IAuthenticationService: IAuthenticationService;
  ITransactionManagerService: ITransactionManagerService;
  IInstrumentationService: IInstrumentationService;
  ICrashReporterService: ICrashReporterService;

  // Repositories
  ITodosRepository: ITodosRepository;
  IUsersRepository: IUsersRepository;

  // Use Cases
  ICreateTodoUseCase: ICreateTodoUseCase;
  IDeleteTodoUseCase: IDeleteTodoUseCase;
  IGetTodosForUserUseCase: IGetTodosForUserUseCase;
  IToggleTodoUseCase: IToggleTodoUseCase;
  ISignInUseCase: ISignInUseCase;
  ISignOutUseCase: ISignOutUseCase;
  ISignUpUseCase: ISignUpUseCase;

  // Controllers
  ISignInController: ISignInController;
  ISignOutController: ISignOutController;
  ISignUpController: ISignUpController;
  IBulkUpdateController: IBulkUpdateController;
  ICreateTodoController: ICreateTodoController;
  IGetTodosForUserController: IGetTodosForUserController;
  IToggleTodoController: IToggleTodoController;
}
