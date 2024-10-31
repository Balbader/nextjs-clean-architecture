/**
 * This controller is part of the Interface Adapters layer in Clean Architecture.
 * It acts as an intermediary between the external world (like HTTP requests) and the application's use cases.
 * 
 * Responsibilities:
 * - Handles authentication validation using the auth service
 * - Converts external request data into the format expected by use cases
 * - Orchestrates the execution of the GetTodosForUser use case
 * - Formats the response data through a presenter
 * - Manages instrumentation/telemetry for monitoring and debugging
 * 
 * This maintains separation of concerns by keeping HTTP/external concepts out of the core business logic,
 * while providing a clean API for the delivery mechanism (e.g. HTTP handlers) to use.
 */

import { IGetTodosForUserUseCase } from '@/src/application/use-cases/todos/get-todos-for-user.use-case';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { Todo } from '@/src/entities/models/todo';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

function presenter(
  todos: Todo[],
  instrumentationService: IInstrumentationService
) {
  return instrumentationService.startSpan(
    { name: 'getTodosForUser Presenter', op: 'serialize' },
    () =>
      todos.map((t) => ({
        id: t.id,
        todo: t.todo,
        userId: t.userId,
        completed: t.completed,
      }))
  );
}

export type IGetTodosForUserController = ReturnType<
  typeof getTodosForUserController
>;

export const getTodosForUserController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    getTodosForUserUseCase: IGetTodosForUserUseCase
  ) =>
    async (
      sessionId: string | undefined
    ): Promise<ReturnType<typeof presenter>> => {
      return await instrumentationService.startSpan(
        { name: 'getTodosForUser Controller' },
        async () => {
          if (!sessionId) {
            throw new UnauthenticatedError('Must be logged in to create a todo');
          }

          const { session } =
            await authenticationService.validateSession(sessionId);

          const todos = await getTodosForUserUseCase(session.userId);

          return presenter(todos, instrumentationService);
        }
      );
    };
