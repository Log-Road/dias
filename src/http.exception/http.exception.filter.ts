import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { WinstonLogger } from 'nest-winston';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  private readonly logger: WinstonLogger;

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    this.logger.error(``)


  }
}
