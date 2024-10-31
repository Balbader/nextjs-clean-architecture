/**
 * Infrastructure layer implementation of the InstrumentationService.
 * This service implements the IInstrumentationService interface from the application layer,
 * following clean architecture principles by providing concrete implementations
 * of instrumentation operations using Sentry as the underlying technology.
 * 
 * This class serves as an adapter between the application layer's abstract instrumentation
 * requirements and the concrete Sentry implementation, maintaining the dependency rule
 * where infrastructure depends on application, but not vice versa.
 */

import * as Sentry from '@sentry/nextjs';

import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

export class InstrumentationService implements IInstrumentationService {
  startSpan<T>(
    options: { name: string; op?: string; attributes?: Record<string, any> },
    callback: () => T
  ): T {
    return Sentry.startSpan(options, callback);
  }

  instrumentServerAction<T>(
    name: string,
    options: Record<string, any>,
    callback: () => T
  ): Promise<T> {
    return Sentry.withServerActionInstrumentation(name, options, callback);
  }
}
