/**
 * Unit tests for the ToggleTodo use case in the Application layer.
 * 
 * In Clean Architecture, use cases represent the application's business rules and orchestrate the flow 
 * of data between the outside world and the system. These tests verify that the ToggleTodo use case:
 * 1. Correctly toggles a todo's completion status when authorized
 * 2. Enforces access control by preventing unauthorized users from toggling others' todos
 * 3. Handles invalid inputs appropriately
 * 
 * The tests focus purely on business logic without any infrastructure concerns,
 * following Clean Architecture's separation of concerns principle.
 */

import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { UnauthorizedError } from '@/src/entities/errors/auth';
import { NotFoundError } from '@/src/entities/errors/common';

const signInUseCase = getInjection('ISignInUseCase');
const createTodoUseCase = getInjection('ICreateTodoUseCase');
const toggleTodoUseCase = getInjection('IToggleTodoUseCase');
const signOutUseCase = getInjection('ISignOutUseCase');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('toggles todo', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  const todo = await createTodoUseCase(
    { todo: 'Write unit tests' },
    session.userId
  );

  expect(
    toggleTodoUseCase({ todoId: todo.id }, session.userId)
  ).resolves.toMatchObject({
    todo: 'Write unit tests',
    userId: '1',
    completed: true,
  });
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
    toggleTodoUseCase({ todoId: todo.id }, sessionTwo.userId)
  ).rejects.toBeInstanceOf(UnauthorizedError);
});

it('throws for invalid input', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  expect(
    toggleTodoUseCase({ todoId: 1234567890 }, session.userId)
  ).rejects.toBeInstanceOf(NotFoundError);
});
