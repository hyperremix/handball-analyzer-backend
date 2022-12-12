import { FactoryProvider, Scope } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerFormat } from './LoggerFormat';

export const LoggerServiceProvider: FactoryProvider<LoggerService> = {
  provide: LoggerService,
  useFactory: (loggerFormat: LoggerFormat): LoggerService => new LoggerService(loggerFormat),
  inject: ['LOGGER_FORMAT'],
  scope: Scope.TRANSIENT,
};
