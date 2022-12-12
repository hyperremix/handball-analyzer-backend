import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const before = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - before;
        const { req, statusCode } = context.getArgByIndex(1);
        const message = `${req.method} ${req.url} ${statusCode} ${duration}ms`;

        if (req) {
          this.logger.info(message, {
            method: req.method,
            path: req.url,
            statusCode,
            duration,
          });
        }
      }),
    );
  }
}
