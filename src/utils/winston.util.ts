import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';

const env = process.env.NODE_ENV;
const logDir = __dirname + '/../../logs'; // log 파일을 관리할 폴더

export const dailyOptions = (logLevel: string) => ({
    logLevel,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${logLevel}`,
    filename: `%DATE%.${logLevel}.log`,
    maxFiles: 30, // 30일치 로그파일 저장
    zippedArchive: true, // 로그가 쌓이면 압축하여 관리
})

// rfc5424를 따르는 winston만의 log level
// error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
export const winstonLogger = WinstonModule.createLogger({
    transports: [
        new winston.transports.Console({
            level: env === 'prod' ? 'http' : 'silly',
            // production 환경이라면 http, 개발환경이라면 모든 단계를 로그
            format: env === 'prod' ? winston.format.simple() : winston.format.combine(
                winston.format.timestamp(),
                utilities.format.nestLike('DAUTH', {
                    colors: true,
                    prettyPrint: true, // nest에서 제공하는 옵션. 로그 가독성을 높여줌
                }),
            ),
        }),

        // info, warn, error, 로그는 파일로 관리
        new winstonDaily(dailyOptions('info')),
        new winstonDaily(dailyOptions('warn')),
        new winstonDaily(dailyOptions('error')),
    ],
});