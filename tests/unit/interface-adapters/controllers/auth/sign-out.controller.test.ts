/**
 * Unit tests for the SignOut Controller in the Interface Adapters layer of Clean Architecture.
 * 
 * In Clean Architecture, controllers are part of the Interface Adapters layer, which converts
 * data between the format most convenient for use cases/entities and the format most convenient
 * for external agencies (like web frameworks). This controller specifically handles the sign-out
 * functionality by managing session cookies and input validation.
 * 
 * These tests verify that the controller properly:
 * 1. Clears session cookies during sign-out
 * 2. Validates input parameters before processing
 */

import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { SESSION_COOKIE } from '@/config';
import { InputParseError } from '@/src/entities/errors/common';

const signInUseCase = getInjection('ISignInUseCase');
const signOutController = getInjection('ISignOutController');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns blank cookie', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  expect(signOutController(session.id)).resolves.toMatchObject({
    name: SESSION_COOKIE,
    value: '',
    attributes: {},
  });
});

it('throws for invalid input', () => {
  expect(signOutController(undefined)).rejects.toBeInstanceOf(InputParseError);
});
