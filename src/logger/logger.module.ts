import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerServiceProvider } from './logger-service.provider';
import { LoggerInterceptor } from './logger.interceptor';
import { LoggerService } from './logger.service';

@Global()
@Module({
  providers: [
    LoggerServiceProvider,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
