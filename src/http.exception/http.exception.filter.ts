import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter<Error> implements ExceptionFilter {
  private readonly logger: Logger;

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    if (!(exception instanceof HttpException))
      exception = new InternalServerErrorException() as any;

    // this.logger.error(
    //   `${req.originalUrl} - ${(exception as HttpException).getStatus()} "${res.message}"`,
    // );
    console.log(`${req.originalUrl} - ${(exception as HttpException).getStatus()} "${(exception as HttpException).message}"`)

    console.log((exception as HttpException).stack)

    return res.status((exception as HttpException).getStatus()).json({
      errCode: (exception as HttpException).getStatus(),
      errMsg: (exception as HttpException).message,
      url: req.originalUrl,
    });
  }
}
