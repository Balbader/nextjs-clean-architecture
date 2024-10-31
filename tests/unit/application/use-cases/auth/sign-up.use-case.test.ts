/**
 * Unit tests for the SignUp use case in the Application layer of Clean Architecture.
 * 
 * In Clean Architecture, use cases represent the application's business rules and orchestrate the flow 
 * of data between the outer layers and the entities. The SignUp use case specifically handles new user 
 * registration by coordinating between the authentication entities and persistence mechanisms.
 * 
 * These tests verify that the use case properly handles both successful registration attempts
 * (returning session data) and invalid inputs (throwing appropriate errors).
 */

import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { AuthenticationError } from '@/src/entities/errors/auth';

const signUpUseCase = getInjection('ISignUpUseCase');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns session and cookie', async () => {
  const result = await signUpUseCase({
    username: 'new',
    password: 'password-new',
  });
  expect(result).toHaveProperty('session');
  expect(result).toHaveProperty('cookie');
  expect(result).toHaveProperty('user');
});

it('throws for invalid input', () => {
  expect(() =>
    signUpUseCase({ username: 'one', password: 'doesntmatter' })
  ).rejects.toBeInstanceOf(AuthenticationError);
});
