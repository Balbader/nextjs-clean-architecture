/**
 * This file contains core error classes used throughout the application.
 * In Clean Architecture, these errors belong to the Entities layer (Enterprise Business Rules),
 * which is the innermost layer and contains the most general and high-level rules.
 * 
 * These error classes are fundamental business objects that can be used across all layers
 * of the application, from the database interface to the presentation layer.
 * Being in the entities layer means they have no dependencies on other layers
 * and can be used anywhere in the application.
 */

export class DatabaseOperationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class NotFoundError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class InputParseError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
