/**
 * Unit tests for the SignUp Controller in the Interface Adapters layer of Clean Architecture.
 * 
 * In Clean Architecture, Controllers act as the entry point to our use cases, handling:
 * 1. Input validation and parsing
 * 2. Converting external data structures into internal entities/models
 * 3. Orchestrating the flow of data to use cases
 * 
 * These tests verify that the SignUp Controller properly:
 * - Validates user registration input
 * - Handles error cases (invalid input, duplicate usernames)
 * - Returns the expected session cookie on successful registration
 */

import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';
import { SESSION_COOKIE } from '@/config';
import { InputParseError } from '@/src/entities/errors/common';
import { AuthenticationError } from '@/src/entities/errors/auth';

const signUpController = getInjection('ISignUpController');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns cookie', async () => {
  const { cookie, user } = await signUpController({
    username: 'nikolovlazar',
    password: 'password',
    confirm_password: 'password',
  });

  expect(user).toBeDefined();
  expect(cookie).toMatchObject({
    name: SESSION_COOKIE,
    value: `random_session_id_${user.id}`,
    attributes: {},
  });
});

it('throws for invalid input', () => {
  // empty object
  expect(signUpController({})).rejects.toBeInstanceOf(InputParseError);

  // below min length
  expect(
    signUpController({
      username: 'no',
      password: 'no',
      confirm_password: 'nah',
    })
  ).rejects.toBeInstanceOf(InputParseError);

  // wrong passwords
  expect(
    signUpController({
      username: 'nikolovlazar',
      password: 'password',
      confirm_password: 'passwords',
    })
  ).rejects.toBeInstanceOf(InputParseError);
});

it('throws for existing username', () => {
  expect(
    signUpController({
      username: 'one',
      password: 'doesntmatter',
      confirm_password: 'doesntmatter',
    })
  ).rejects.toBeInstanceOf(AuthenticationError);
});
