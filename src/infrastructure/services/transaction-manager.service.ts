/**
 * Infrastructure Layer - Transaction Manager Service Implementation
 * 
 * This service implements the ITransactionManagerService interface from the application layer,
 * providing concrete database transaction handling functionality. Following clean architecture principles,
 * this implementation lives in the infrastructure layer as it deals directly with external concerns
 * (database transactions) while adhering to an interface defined in the application layer.
 * 
 * The service encapsulates the details of how transactions are actually managed at the database level,
 * allowing the application layer to remain agnostic of the specific database technology being used.
 */

import { db, Transaction } from '@/drizzle';
import { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';

export class TransactionManagerService implements ITransactionManagerService {
  public startTransaction<T>(
    clb: (tx: Transaction) => Promise<T>,
    parent?: Transaction
  ): Promise<T> {
    const invoker = parent ?? db;
    return invoker.transaction(clb);
  }
}
