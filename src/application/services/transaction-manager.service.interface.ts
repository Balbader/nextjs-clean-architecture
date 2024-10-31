/**
 * This interface represents a Transaction Manager Service in the Application Layer of Clean Architecture.
 * It acts as a port (interface) that defines how the application core interacts with transactional operations.
 * 
 * In Clean Architecture, this interface belongs to the Application Service layer, which orchestrates the flow
 * of data and business rules. It defines a contract for managing database transactions without exposing
 * the implementation details, following the Dependency Inversion Principle.
 * 
 * The actual implementation of this interface would be provided by an adapter in the infrastructure layer,
 * allowing for different transaction management strategies while keeping the application core independent
 * of specific database technologies.
 */

import type { ITransaction } from '@/src/entities/models/transaction.interface';

export interface ITransactionManagerService {
  startTransaction<T>(
    clb: (tx: ITransaction) => Promise<T>,
    parent?: ITransaction
  ): Promise<T>;
}
