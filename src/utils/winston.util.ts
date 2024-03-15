import winston, { createLogger, format, transports } from 'winston';

export const levAndColor = {
  levels: {
    crit: 0,
    error: 1,
    warn: 2,
    notice: 3,
    info: 4,
    debug: 5,
  },
  colors: {
    crit: 'red',
    error: 'magenta',
    warn: 'yellow',
    notice: 'blue',
    info: 'white',
    debug: 'grey',
  }
}

export const WinstonInstance = createLogger({
  levels: levAndColor.levels,
  exitOnError: false,
  transports: [
    new transports.File({ filename: 'warn.log', level: 'warn' }),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'crit.log', level: 'crit' }),
    new transports.Console({ format: format.printf(({level, message}) => `[${level}] ${new Date().toISOString()} [DAUTH] - ${message}`),})
  ],
  format: format.printf(({level, message}) => `[${level}] ${new Date().toISOString()} [DAUTH] - ${message}`),
});

// Syslog format refer : https://yeonfamily.tistory.com/22
// Syslog Format : RFC3164
// <priority>[timestamp] [hostname] [processname] [message]