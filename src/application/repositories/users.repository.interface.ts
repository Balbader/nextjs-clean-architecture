/**
 * Interface for the Users Repository following Clean Architecture principles.
 * This interface belongs to the application layer and defines the contract that any
 * concrete implementation of the users repository must follow.
 * 
 * In Clean Architecture, this interface acts as a boundary between the application layer
 * and the infrastructure layer. It allows the application core to remain independent of
 * the actual database implementation, following the Dependency Inversion Principle.
 * The concrete implementation of this interface will be provided by the infrastructure layer.
 */

import type { User } from '@/src/entities/models/user';
import type { ITransaction } from '@/src/entities/models/transaction.interface';

export interface IUsersRepository {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(input: User, tx?: ITransaction): Promise<User>;
}
