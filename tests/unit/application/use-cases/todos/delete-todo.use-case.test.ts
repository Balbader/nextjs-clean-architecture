/**
 * Unit tests for the DeleteTodo use case.
 * 
 * In clean architecture, use cases represent the application's business rules and orchestrate the flow 
 * of data between the outer layers (like controllers/UI) and the domain entities. These tests verify 
 * that the DeleteTodo use case correctly handles:
 * - Successful todo deletion
 * - Authorization checks (only todo owners can delete their todos)
 * - Error cases (invalid inputs, not found scenarios)
 * 
 * The tests are isolated from external dependencies and focus purely on the business logic
 * of todo deletion within the application layer.
 */

import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';

import { UnauthorizedError } from '@/src/entities/errors/auth';
import { NotFoundError } from '@/src/entities/errors/common';

const signInUseCase = getInjection('ISignInUseCase');
const createTodoUseCase = getInjection('ICreateTodoUseCase');
const deleteTodoUseCase = getInjection('IDeleteTodoUseCase');
const getTodosForUserUseCase = getInjection('IGetTodosForUserUseCase');
const signOutUseCase = getInjection('ISignOutUseCase');
// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('deletes todo', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  const todo = await createTodoUseCase(
    { todo: 'Write unit tests' },
    session.userId
  );

  // Deletion returns the deleted object
  await expect(
    deleteTodoUseCase({ todoId: todo.id }, session.userId)
  ).resolves.toMatchObject({
    todo: 'Write unit tests',
    userId: '1',
  });

  // Todos should be empty at this point
  await expect(getTodosForUserUseCase(session.userId)).resolves.toMatchObject(
    []
  );
});

it('throws when unauthorized', async () => {
  const { session: sessionOne } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  const todo = await createTodoUseCase(
    { todo: 'Write unit tests' },
    sessionOne.userId
  );

  await signOutUseCase(sessionOne.id);

  const { session: sessionTwo } = await signInUseCase({
    username: 'two',
    password: 'password-two',
  });

  expect(
    deleteTodoUseCase({ todoId: todo.id }, sessionTwo.userId)
  ).rejects.toBeInstanceOf(UnauthorizedError);
});

it('throws for invalid input', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  expect(
    deleteTodoUseCase({ todoId: 1234567890 }, session.userId)
  ).rejects.toBeInstanceOf(NotFoundError);
});
