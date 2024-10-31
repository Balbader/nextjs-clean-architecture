/**
 * Mock implementation of the CrashReporter service for testing purposes.
 * 
 * In Clean Architecture, this mock class lives in the Infrastructure layer and implements
 * the ICrashReporterService interface from the Application layer. This follows the Dependency
 * Inversion Principle, where high-level modules (Application layer) don't depend on low-level
 * modules (Infrastructure layer), but both depend on abstractions.
 * 
 * This mock is used during testing to provide a controlled implementation of the crash
 * reporting functionality without actually sending reports to an external service.
 */

import { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';

export class MockCrashReporterService implements ICrashReporterService {
  report(_: any): string {
    return 'errorId';
  }
}
