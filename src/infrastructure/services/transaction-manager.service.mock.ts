/**
 * Mock implementation of the TransactionManager service for testing purposes.
 * 
 * In Clean Architecture, this mock class belongs to the Infrastructure layer and implements
 * the ITransactionManagerService interface from the Application layer. It provides a test double
 * that simulates transaction behavior without actually performing database operations.
 * 
 * This follows the Dependency Inversion Principle by depending on abstractions (the interface)
 * rather than concrete implementations, allowing for easy substitution in test environments.
 */

import { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';
import { ITransaction } from '@/src/entities/models/transaction.interface';

export class MockTransactionManagerService
  implements ITransactionManagerService {
  public startTransaction<T>(
    clb: (tx: ITransaction) => Promise<T>
  ): Promise<T> {
    return clb({ rollback: () => { } });
  }
}
