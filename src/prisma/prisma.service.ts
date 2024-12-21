import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomLogger } from '../common/logger/logger.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly logger: CustomLogger) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma Client connected successfully', 'PrismaService');

    this.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();

      this.logger.debug(`Prisma Query ${params.model}.${params.action}`, 'PrismaService', {
        duration: `${after - before}ms`,
        model: params.model,
        action: params.action,
        args: params.args
      });

      return result;
    });
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting Prisma Client', 'PrismaService');
    await this.$disconnect();
  }
} 