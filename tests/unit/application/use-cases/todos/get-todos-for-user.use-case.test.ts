/**
 * Unit tests for the GetTodosForUser use case.
 * 
 * In Clean Architecture, this test file verifies the behavior of a use case in the application layer.
 * Use cases represent the business rules and application-specific business rules of the system.
 * They orchestrate the flow of data and implement the business rules independent of any external agency.
 * 
 * This particular use case test ensures that users can retrieve their todos correctly,
 * verifying core business rules like:
 * - Users can only see their own todos
 * - Todos are returned with the correct properties (todo text, completion status)
 * - The system maintains the order and integrity of the todo list
 */

import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';

const signInUseCase = getInjection('ISignInUseCase');
const createTodoUseCase = getInjection('ICreateTodoUseCase');
const getTodosForUserUseCase = getInjection('IGetTodosForUserUseCase');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns todos', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });
  expect(getTodosForUserUseCase(session.userId)).resolves.toHaveLength(0);

  await createTodoUseCase({ todo: 'todo-one' }, session.userId);
  await createTodoUseCase({ todo: 'todo-two' }, session.userId);
  await createTodoUseCase({ todo: 'todo-three' }, session.userId);

  expect(getTodosForUserUseCase(session.userId)).resolves.toMatchObject([
    {
      todo: 'todo-one',
      userId: '1',
      completed: false,
    },
    {
      todo: 'todo-two',
      userId: '1',
      completed: false,
    },
    {
      todo: 'todo-three',
      userId: '1',
      completed: false,
    },
  ]);
});
