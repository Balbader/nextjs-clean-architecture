/**
 * Tests for the ToggleTodoController in the Interface Adapters layer of Clean Architecture.
 * 
 * In Clean Architecture, controllers act as the entry point to our business logic,
 * handling the translation between the delivery mechanism (e.g., HTTP requests) 
 * and our use cases. This test suite verifies that the ToggleTodoController:
 * 
 * 1. Properly handles the toggling of todo completion states
 * 2. Validates input data
 * 3. Enforces authentication and authorization rules
 * 4. Maintains proper separation of concerns by delegating business logic to use cases
 */

import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import {
  UnauthenticatedError,
  UnauthorizedError,
} from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';

const signInUseCase = getInjection('ISignInUseCase');
const createTodoUseCase = getInjection('ICreateTodoUseCase');
const toggleTodoController = getInjection('IToggleTodoController');
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

  expect(todo.completed).toBe(false);

  await expect(
    toggleTodoController({ todoId: todo.id }, session.id)
  ).resolves.toMatchObject({
    todo: 'Write unit tests',
    completed: true,
    userId: '1',
  });

  await expect(
    toggleTodoController({ todoId: todo.id }, session.id)
  ).resolves.toMatchObject({
    todo: 'Write unit tests',
    completed: false,
    userId: '1',
  });
});

it('throws for invalid input', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  // @ts-ignore
  expect(toggleTodoController(undefined, session.id)).rejects.toBeInstanceOf(
    InputParseError
  );
  expect(toggleTodoController({}, session.id)).rejects.toBeInstanceOf(
    InputParseError
  );
});

it('throws when unauthenticated', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  const todo = await createTodoUseCase(
    { todo: 'Write unit tests' },
    session.userId
  );

  await signOutUseCase(session.id);

  // with valid session id, but expired session
  expect(
    toggleTodoController({ todoId: todo.id }, session.id)
  ).rejects.toBeInstanceOf(UnauthenticatedError);

  // with undefined session id
  expect(
    toggleTodoController({ todoId: todo.id }, undefined)
  ).rejects.toBeInstanceOf(UnauthenticatedError);
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
    toggleTodoController({ todoId: todo.id }, sessionTwo.id)
  ).rejects.toBeInstanceOf(UnauthorizedError);
});
