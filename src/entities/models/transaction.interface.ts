/**
 * This interface represents a Transaction entity in the clean architecture pattern.
 * It belongs to the Entities layer (Enterprise Business Rules), which contains
 * the most high-level and abstract business rules. The Transaction interface
 * defines the core behavior of a transaction without any implementation details
 * or dependencies on external frameworks/libraries.
 * 
 * In clean architecture, entities encapsulate the most general and high-level
 * rules of the business. They are the least likely to change when something
 * external changes (UI, database, frameworks, etc).
 */
export interface ITransaction {
  rollback: () => void;
}
