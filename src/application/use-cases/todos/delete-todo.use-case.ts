/**
 * Delete Todo Use Case
 * 
 * This file implements a use case in the Clean Architecture pattern, representing
 * an application-specific business rule for deleting a todo item. Use cases sit in
 * the application layer and orchestrate the flow of data between the outer layers
 * (like controllers/UI) and the domain entities.
 * 
 * The use case:
 * 1. Validates that the todo exists
 * 2. Ensures the user has permission to delete it
 * 3. Coordinates with the repository to perform the deletion
 * 4. Provides instrumentation/monitoring of the operation
 * 
 * It depends on abstractions (interfaces) rather than concrete implementations,
 * following the Dependency Inversion Principle.
 */

import { UnauthorizedError } from '@/src/entities/errors/auth';
import { NotFoundError } from '@/src/entities/errors/common';
import type { Todo } from '@/src/entities/models/todo';
import type { ITransaction } from '@/src/entities/models/transaction.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';

export type IDeleteTodoUseCase = ReturnType<typeof deleteTodoUseCase>;

export const deleteTodoUseCase =
  (
    instrumentationService: IInstrumentationService,
    todosRepository: ITodosRepository
  ) =>
    (
      input: {
        todoId: number;
      },
      userId: string,
      tx?: ITransaction
    ): Promise<Todo> => {
      return instrumentationService.startSpan(
        { name: 'deleteTodo Use Case', op: 'function' },
        async () => {
          const todo = await todosRepository.getTodo(input.todoId);

          if (!todo) {
            throw new NotFoundError('Todo does not exist');
          }

          if (todo.userId !== userId) {
            throw new UnauthorizedError(
              'Cannot delete todo. Reason: unauthorized'
            );
          }

          await todosRepository.deleteTodo(todo.id, tx);

          return todo;
        }
      );
    };
