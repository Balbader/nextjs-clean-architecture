/**
 * Unit tests for the SignIn use case, which belongs to the Application layer in Clean Architecture.
 * 
 * In Clean Architecture, use cases represent the application's business rules and orchestrate the flow 
 * of data between the outer layers (infrastructure/frameworks) and the inner layers (entities/business rules).
 * 
 * These tests verify that the SignIn use case correctly:
 * - Authenticates valid user credentials and returns proper session data
 * - Handles invalid authentication attempts by throwing appropriate errors
 * - Maintains separation of concerns by operating only on domain entities and interfaces
 */

import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { AuthenticationError } from '@/src/entities/errors/auth';

const signInUseCase = getInjection('ISignInUseCase');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns session and cookie', async () => {
  const result = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });
  expect(result).toHaveProperty('session');
  expect(result).toHaveProperty('cookie');
  expect(result.session.userId).toBe('1');
});

it('throws for invalid input', () => {
  expect(() =>
    signInUseCase({ username: 'non-existing', password: 'doesntmatter' })
  ).rejects.toBeInstanceOf(AuthenticationError);

  expect(() =>
    signInUseCase({ username: 'one', password: 'password-two' })
  ).rejects.toBeInstanceOf(AuthenticationError);
});
