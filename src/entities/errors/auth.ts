/**
 * This file contains custom error classes for authentication-related errors in the application.
 * In clean architecture, these error classes belong to the Entities layer (enterprise business rules).
 * They represent core business error types that are independent of any frameworks or external agencies.
 * 
 * These error types can be used across all layers of the application while maintaining the dependency rule
 * of clean architecture (dependencies can only point inward toward the entities layer).
 */

export class AuthenticationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class UnauthenticatedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
