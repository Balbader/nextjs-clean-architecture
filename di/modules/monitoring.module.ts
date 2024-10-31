/**
 * Monitoring Module - Dependency Injection Configuration
 * 
 * This module is part of the infrastructure layer in Clean Architecture.
 * It handles the registration of monitoring-related services (instrumentation and crash reporting)
 * in the dependency injection container. Following the Dependency Inversion Principle,
 * it binds concrete implementations to their abstract interfaces based on the environment.
 * 
 * In test environments, it uses mock implementations to facilitate testing,
 * while in production it uses real implementations for actual monitoring.
 */

import { Container } from '@evyweb/ioctopus';

import { MockInstrumentationService } from '@/src/infrastructure/services/instrumentation.service.mock';
import { InstrumentationService } from '@/src/infrastructure/services/instrumentation.service';
import { MockCrashReporterService } from '@/src/infrastructure/services/crash-reporter.service.mock';
import { CrashReporterService } from '@/src/infrastructure/services/crash-reporter.service';

import { DI_SYMBOLS } from '@/di/types';

export function registerMonitoringModule(container: Container) {
  if (process.env.NODE_ENV === 'test') {
    container
      .bind(DI_SYMBOLS.IInstrumentationService)
      .toClass(MockInstrumentationService);
    container
      .bind(DI_SYMBOLS.ICrashReporterService)
      .toClass(MockCrashReporterService);
  } else {
    container
      .bind(DI_SYMBOLS.IInstrumentationService)
      .toClass(InstrumentationService);
    container
      .bind(DI_SYMBOLS.ICrashReporterService)
      .toClass(CrashReporterService);
  }
}
