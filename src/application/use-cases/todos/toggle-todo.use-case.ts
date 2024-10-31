/**
 * Toggle Todo Use Case
 * 
 * This file is part of the Application Layer in Clean Architecture.
 * Use cases encapsulate and implement all of the business rules and application logic
 * for a specific action in the system.
 * 
 * This particular use case handles the business logic for toggling a todo's completion status.
 * It enforces business rules such as:
 * - Verifying the todo exists
 * - Ensuring the user has permission to modify the todo
 * - Managing the state transition of the todo's completion status
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

export type IToggleTodoUseCase = ReturnType<typeof toggleTodoUseCase>;

export const toggleTodoUseCase =
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
        { name: 'toggleTodo Use Case', op: 'function' },
        async () => {
          const todo = await todosRepository.getTodo(input.todoId);

          if (!todo) {
            throw new NotFoundError('Todo does not exist');
          }

          if (todo.userId !== userId) {
            throw new UnauthorizedError(
              'Cannot toggle todo. Reason: unauthorized'
            );
          }

          const updatedTodo = await todosRepository.updateTodo(
            todo.id,
            {
              completed: !todo.completed,
            },
            tx
          );

          return updatedTodo;
        }
      );
    };
