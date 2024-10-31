/**
 * Create Todo Use Case
 * 
 * This file represents a use case in the Clean Architecture pattern, sitting in the Application/Use Cases layer.
 * Use cases encapsulate and implement all of the business rules and business logic of the system.
 * 
 * This particular use case handles the creation of new todos, including:
 * - Input validation
 * - Business rules enforcement (like minimum length requirements)
 * - Orchestrating the persistence through the repository layer
 * - Instrumentation/monitoring of the operation
 * 
 * It depends on abstractions (interfaces) rather than concrete implementations, following
 * the Dependency Inversion Principle of SOLID.
 */

import { InputParseError } from '@/src/entities/errors/common';
import type { Todo } from '@/src/entities/models/todo';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';

export type ICreateTodoUseCase = ReturnType<typeof createTodoUseCase>;

export const createTodoUseCase =
  (
    instrumentationService: IInstrumentationService,
    todosRepository: ITodosRepository
  ) =>
    (
      input: {
        todo: string;
      },
      userId: string,
      tx?: any
    ): Promise<Todo> => {
      return instrumentationService.startSpan(
        { name: 'createTodo Use Case', op: 'function' },
        async () => {
          // HINT: this is where you'd do authorization checks - is this user authorized to create a todo
          // for example: free users are allowed only 5 todos, throw an UnauthorizedError if more than 5

          if (input.todo.length < 4) {
            throw new InputParseError('Todo must be at least 4 chars');
          }

          const newTodo = await todosRepository.createTodo(
            {
              todo: input.todo,
              userId,
              completed: false,
            },
            tx
          );

          return newTodo;
        }
      );
    };
