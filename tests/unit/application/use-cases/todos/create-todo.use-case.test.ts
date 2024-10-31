/**
 * Unit tests for the CreateTodo use case.
 * 
 * In Clean Architecture, use cases represent the application's business rules and orchestrate the flow of data
 * between the outer layers (like controllers/UI) and the domain entities. This test file ensures that the
 * CreateTodo use case correctly handles the creation of new todo items while maintaining proper user context
 * and business rules.
 * 
 * The use case sits in the application layer, which means it:
 * 1. Coordinates the interaction between outer layers and domain logic
 * 2. Enforces business rules specific to creating todos
 * 3. Maintains user session context for proper authorization
 */

import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';

const signInUseCase = getInjection('ISignInUseCase');
const createTodoUseCase = getInjection('ICreateTodoUseCase');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('creates todo', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  expect(
    createTodoUseCase({ todo: 'Write unit tests' }, session.userId)
  ).resolves.toMatchObject({
    todo: 'Write unit tests',
    userId: '1',
    completed: false,
  });
});
