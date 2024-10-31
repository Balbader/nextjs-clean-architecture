/**
 * Mock implementation of the InstrumentationService for testing purposes.
 * 
 * In Clean Architecture, this mock service resides in the Infrastructure layer
 * and implements the IInstrumentationService interface from the Application layer.
 * It provides a simplified, no-op implementation of instrumentation methods,
 * allowing tests to run without actual instrumentation dependencies.
 * This follows the Dependency Inversion Principle, where high-level modules
 * (Application layer) are not dependent on low-level modules (Infrastructure layer),
 * but both depend on abstractions.
 */

import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

export class MockInstrumentationService implements IInstrumentationService {
  startSpan<T>(
    _: { name: string; op?: string; attributes?: Record<string, any> },
    callback: () => T
  ): T {
    return callback();
  }

  async instrumentServerAction<T>(
    _: string,
    __: Record<string, any>,
    callback: () => T
  ): Promise<T> {
    return callback();
  }
}
