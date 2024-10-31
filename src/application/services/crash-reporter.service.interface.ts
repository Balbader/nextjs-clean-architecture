/**
 * Interface for crash reporting service in the application layer of Clean Architecture.
 * 
 * This interface acts as a boundary between the application core and external crash reporting tools.
 * Following the Dependency Inversion Principle, the application core depends on this abstraction,
 * while concrete implementations (like Sentry, Bugsnag, etc.) in the infrastructure layer implement
 * this interface. This ensures that the application core remains independent of specific crash
 * reporting technologies and can easily switch between different implementations.
 */
export interface ICrashReporterService {
  report(error: any): string;
}
