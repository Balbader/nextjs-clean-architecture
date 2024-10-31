/**
 * Infrastructure Layer - Crash Reporter Service Implementation
 * 
 * This service implements the ICrashReporterService interface from the application layer,
 * providing concrete implementation for error reporting using Sentry.
 * 
 * In clean architecture, this class belongs to the infrastructure/outer layer as it deals
 * with external services (Sentry) and implements the interface defined in the application layer.
 * This follows the dependency inversion principle where high-level modules (application layer)
 * don't depend on low-level modules (infrastructure layer), but both depend on abstractions.
 */

import * as Sentry from '@sentry/nextjs';

import { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';

export class CrashReporterService implements ICrashReporterService {
  report(error: any): string {
    return Sentry.captureException(error);
  }
}
