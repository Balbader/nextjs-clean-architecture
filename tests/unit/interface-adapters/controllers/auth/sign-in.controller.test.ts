/**
 * Unit tests for the SignIn Controller in the Interface Adapters layer of Clean Architecture.
 * 
 * In Clean Architecture, Controllers are part of the Interface Adapters layer, which sits between
 * the outer Frameworks/Drivers layer and the inner Application Business Rules layer. The SignIn
 * Controller is responsible for:
 * 1. Validating and parsing input data from the outer layer
 * 2. Converting that data into a format suitable for the use case
 * 3. Handling the response from the use case and converting it back to a format suitable for
 *    the delivery mechanism (in this case, a session cookie)
 * 
 * These tests verify the controller's input validation, error handling, and successful authentication flow.
 */

import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { SESSION_COOKIE } from '@/config';
import { InputParseError } from '@/src/entities/errors/common';
import { AuthenticationError } from '@/src/entities/errors/auth';

const signInController = getInjection('ISignInController');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('signs in with valid input', () => {
  expect(
    signInController({ username: 'one', password: 'password-one' })
  ).resolves.toMatchObject({
    name: SESSION_COOKIE,
    value: 'random_session_id_1',
    attributes: {},
  });
});

it('throws for invalid input', () => {
  expect(signInController({ username: '' })).rejects.toBeInstanceOf(
    InputParseError
  );
  expect(signInController({ password: '' })).rejects.toBeInstanceOf(
    InputParseError
  );
  expect(signInController({ username: 'no' })).rejects.toBeInstanceOf(
    InputParseError
  );
  expect(signInController({ password: 'no' })).rejects.toBeInstanceOf(
    InputParseError
  );
  expect(
    signInController({ username: 'one', password: 'short' })
  ).rejects.toBeInstanceOf(InputParseError);
  expect(
    signInController({
      username: 'oneverylongusernamethatmakesnosense',
      password: 'short',
    })
  ).rejects.toBeInstanceOf(InputParseError);
  expect(
    signInController({
      username: 'one',
      password: 'oneverylongpasswordthatmakesnosense',
    })
  ).rejects.toBeInstanceOf(InputParseError);
  expect(
    signInController({
      username: 'oneverylongusernamethatmakesnosense',
      password: 'oneverylongpasswordthatmakesnosense',
    })
  ).rejects.toBeInstanceOf(InputParseError);
});

it('throws for invalid credentials', async () => {
  await expect(
    signInController({ username: 'nonexisting', password: 'doesntmatter' })
  ).rejects.toBeInstanceOf(AuthenticationError);
  expect(
    signInController({ username: 'one', password: 'wrongpass' })
  ).rejects.toBeInstanceOf(AuthenticationError);
});
