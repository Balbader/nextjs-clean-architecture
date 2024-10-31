/**
 * This use case implements the business logic for retrieving todos for a specific user.
 * In clean architecture, use cases (also known as interactors) represent application-specific business rules
 * and orchestrate the flow of data between the outer layers (like controllers/presenters) and the inner layers
 * (like entities and repositories).
 * 
 * This particular use case:
 * 1. Takes a userId as input
 * 2. Uses instrumentation for performance monitoring/tracing
 * 3. Delegates the actual data retrieval to the todos repository
 * 4. Returns a list of Todo entities
 */

import type { Todo } from '@/src/entities/models/todo';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';

export type IGetTodosForUserUseCase = ReturnType<typeof getTodosForUserUseCase>;

export const getTodosForUserUseCase =
  (
    instrumentationService: IInstrumentationService,
    todosRepository: ITodosRepository
  ) =>
    (userId: string): Promise<Todo[]> => {
      return instrumentationService.startSpan(
        { name: 'getTodosForUser UseCase', op: 'function' },
        async () => {
          return await todosRepository.getTodosForUser(userId);
        }
      );
    };
