import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoggerService } from 'logger';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const before = Date.now();

    return next.handle().pipe(
      catchError((error) => {
        const { req } = context.getArgByIndex(1);
        const method = req?.method;
        const path = req?.url;
        const duration = Date.now() - before;

        switch (error.constructor) {
          case UnauthorizedException:
            this.logger.warn(error);
            break;
          case ForbiddenException:
            this.logger.warn(error);
            break;
          case NotFoundException:
            this.logger.warn(error);
            break;
          case ConflictException:
            this.logger.warn(error);
            break;
          default:
            const [req] = context.getArgs();

            if (error instanceof Error) {
              this.logger.error(
                `Error: ${error.message}. Additional info: req ${req.method} ${req.url} at ${
                  context.getClass().name
                }.${context.getHandler().name}`,
                error.stack,
              );
            }

            break;
        }

        this.logDuration(method, path, new InternalServerErrorException(), duration);
        throw error;
      }),
    );
  }

  private logDuration(method: string, path: string, exception: HttpException, duration: number) {
    const statusCode = exception.getStatus();
    this.logger.info(`${method} ${path} ${statusCode} ${duration}ms`, {
      method,
      path,
      statusCode,
      duration,
    });
  }
}
