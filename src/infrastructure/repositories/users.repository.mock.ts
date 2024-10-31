/**
 * Mock Users Repository Implementation
 * 
 * This file is part of the Infrastructure layer in Clean Architecture.
 * It provides a mock implementation of the IUsersRepository interface
 * defined in the Application layer. This mock repository is primarily 
 * used for testing purposes and contains hardcoded user data.
 * 
 * In Clean Architecture, repositories in the Infrastructure layer implement
 * interfaces defined in the Application layer, allowing for dependency
 * inversion and making the system more testable and maintainable.
 */

import { hashSync } from 'bcrypt-ts';

import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { User } from '@/src/entities/models/user';
import { PASSWORD_SALT_ROUNDS } from '@/config';

export class MockUsersRepository implements IUsersRepository {
  private _users: User[];

  constructor() {
    this._users = [
      {
        id: '1',
        username: 'one',
        password_hash: hashSync('password-one', PASSWORD_SALT_ROUNDS),
      },
      {
        id: '2',
        username: 'two',
        password_hash: hashSync('password-two', PASSWORD_SALT_ROUNDS),
      },
      {
        id: '3',
        username: 'three',
        password_hash: hashSync('password-three', PASSWORD_SALT_ROUNDS),
      },
    ];
  }

  async getUser(id: string): Promise<User | undefined> {
    const user = this._users.find((u) => u.id === id);
    return user;
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = this._users.find((u) => u.username === username);
    return user;
  }
  async createUser(input: User): Promise<User> {
    this._users.push(input);
    return input;
  }
}
