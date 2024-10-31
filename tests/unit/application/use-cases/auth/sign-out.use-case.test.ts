/**
 * Unit tests for the SignOut use case in the application layer.
 * 
 * In clean architecture, use cases (also known as interactors) represent the application's
 * business rules and orchestrate the flow of data between the outer layers and entities.
 * This test suite verifies that the SignOut use case correctly handles user session 
 * termination by ensuring it returns a blank session cookie, which effectively logs 
 * the user out of the system.
 */

import { expect, it } from 'vitest';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';

const signInUseCase = getInjection('ISignInUseCase');
const signOutUseCase = getInjection('ISignOutUseCase');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns blank cookie', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  expect(signOutUseCase(session.id)).resolves.toMatchObject({
    blankCookie: {
      name: SESSION_COOKIE,
      value: '',
      attributes: {},
    },
  });
});
