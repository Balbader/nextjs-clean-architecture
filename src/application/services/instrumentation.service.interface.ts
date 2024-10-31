/**
 * This interface defines the contract for instrumentation services in the application layer
 * of our clean architecture. It serves as a boundary between the application core and
 * external instrumentation/monitoring concerns.
 * 
 * Following clean architecture principles, this interface allows the application core to
 * remain independent of specific instrumentation implementations while enabling performance
 * monitoring, tracing, and debugging capabilities through dependency injection.
 * 
 * The interface provides methods for creating spans (units of work) and instrumenting
 * server actions, allowing the application to track and measure operations without
 * coupling to specific monitoring tools or vendors.
 */
export interface IInstrumentationService {
  startSpan<T>(
    options: { name: string; op?: string; attributes?: Record<string, any> },
    callback: () => T
  ): T;
  instrumentServerAction<T>(
    name: string,
    options: Record<string, any>,
    callback: () => T
  ): Promise<T>;
}
