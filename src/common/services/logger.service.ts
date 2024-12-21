import { Injectable, LogLevel } from '@nestjs/common';
import * as winston from 'winston';
import * as WinstonCloudWatch from 'winston-cloudwatch';

@Injectable()
export class CustomLogger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      defaultMeta: {
        service: process.env.SERVICE_NAME || 'nestjs-app',
        environment: process.env.NODE_ENV
      },
      transports: [
        new winston.transports.Console({
          format: winston.format.simple()
        }),
        new WinstonCloudWatch({
          logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
          logStreamName: `${process.env.SERVICE_NAME}-${process.env.NODE_ENV}`,
          awsRegion: process.env.AWS_REGION,
          messageFormatter: ({ level, message, ...meta }) => {
            return JSON.stringify({
              level,
              message,
              ...meta,
              timestamp: new Date().toISOString()
            });
          }
        })
      ]
    });
  }

  log(message: string, context?: string, meta?: any) {
    this.logger.info(message, { context, ...meta });
  }

  error(message: string, trace?: string, context?: string, meta?: any) {
    this.logger.error(message, { trace, context, ...meta });
  }

  warn(message: string, context?: string, meta?: any) {
    this.logger.warn(message, { context, ...meta });
  }

  debug(message: string, context?: string, meta?: any) {
    this.logger.debug(message, { context, ...meta });
  }
} 