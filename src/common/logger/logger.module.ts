import { Global, Module } from '@nestjs/common';
import { CustomLogger } from './logger.service';

@Global()  // 전역 모듈로 설정
@Module({
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class LoggerModule {} 