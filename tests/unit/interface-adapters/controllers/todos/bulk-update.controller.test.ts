/**
 * Unit tests for the Bulk Update Controller in the Interface Adapters layer of Clean Architecture.
 * 
 * In Clean Architecture, controllers act as interface adapters that convert data from the format most 
 * convenient for use cases and entities, to the format most convenient for external agencies (like web).
 * 
 * This test suite verifies the bulk update controller's ability to:
 * - Handle multiple todo updates and deletions in a single operation
 * - Validate input data
 * - Manage transaction rollbacks on errors
 * - Handle authentication requirements
 */

import { expect, it, vi } from 'vitest';

import { getInjection } from '@/di/container';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';

const signInUseCase = getInjection('ISignInUseCase');
const createTodoUseCase = getInjection('ICreateTodoUseCase');
const bulkUpdateController = getInjection('IBulkUpdateController');
const getTodosForUserController = getInjection('IGetTodosForUserController');
const signOutUseCase = getInjection('ISignOutUseCase');
// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('bulk updates', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  const todoOne = await createTodoUseCase(
    { todo: 'Write unit tests' },
    session.userId
  );
  const todoTwo = await createTodoUseCase(
    { todo: 'Bulk update' },
    session.userId
  );
  const todoThree = await createTodoUseCase(
    { todo: 'Improve DX' },
    session.userId
  );

  await bulkUpdateController(
    { dirty: [todoTwo.id], deleted: [todoOne.id, todoThree.id] },
    session.id
  );

  await expect(getTodosForUserController(session.id)).resolves.toMatchObject([
    {
      todo: todoTwo.todo,
      completed: !todoTwo.completed,
      userId: '1',
    },
  ]);
});

it('throws for invalid input', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  // @ts-ignore
  expect(bulkUpdateController(undefined, session.id)).rejects.toBeInstanceOf(
    InputParseError
  );

  // @ts-ignore
  expect(bulkUpdateController({}, session.id)).rejects.toBeInstanceOf(
    InputParseError
  );

  expect(
    // @ts-ignore
    bulkUpdateController({ dirty: [] }, session.id)
  ).rejects.toBeInstanceOf(InputParseError);

  expect(
    // @ts-ignore
    bulkUpdateController({ deleted: [] }, session.id)
  ).rejects.toBeInstanceOf(InputParseError);
});

it('rolls back when an error happens', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  const todoOne = await createTodoUseCase(
    { todo: 'Write unit tests' },
    session.userId
  );
  const todoTwo = await createTodoUseCase(
    { todo: 'Bulk update' },
    session.userId
  );
  const todoThree = await createTodoUseCase(
    { todo: 'Improve DX' },
    session.userId
  );

  const consoleErrorSpy = vi
    .spyOn(console, 'error')
    .mockImplementation(() => { });

  // Delete the 1st and 3rd before attempting to update them
  await bulkUpdateController(
    { dirty: [], deleted: [todoOne.id, todoThree.id] },
    session.id
  );

  // Invoke the bulk update with the deleted todos
  await bulkUpdateController(
    { dirty: [todoOne.id, todoTwo.id, todoThree.id], deleted: [] },
    session.id
  );

  expect(consoleErrorSpy).toHaveBeenLastCalledWith('Rolling back toggles!');

  // Invoke the bulk update with the deleted todos
  await bulkUpdateController(
    { deleted: [todoOne.id, todoTwo.id, todoThree.id], dirty: [] },
    session.id
  );

  expect(consoleErrorSpy).toHaveBeenLastCalledWith('Rolling back deletes!');

  consoleErrorSpy.mockRestore();
  vi.restoreAllMocks();
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
    bulkUpdateController({ dirty: [todo.id], deleted: [] }, session.id)
  ).rejects.toBeInstanceOf(UnauthenticatedError);

  // with undefined session id
  expect(
    bulkUpdateController({ dirty: [todo.id], deleted: [] }, undefined)
  ).rejects.toBeInstanceOf(UnauthenticatedError);
});
