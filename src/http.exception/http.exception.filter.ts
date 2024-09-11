import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter<Error> implements ExceptionFilter {
  constructor(
      @Inject(Logger) private readonly logger: Logger
    ){}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    if (!(exception instanceof HttpException))
      exception = new InternalServerErrorException() as any;

    this.logger.warn(`${req.originalUrl} : ${(exception as HttpException).getStatus()} "${(exception as HttpException).message}"`)
    // <priority>[timestamp] [hostname] [processname] [message]

    return res.status((exception as HttpException).getStatus()).json({
      errCode: (exception as HttpException).getStatus(),
      errMsg: (exception as HttpException).message,
      url: req.originalUrl,
    });
  }
}
