import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('hello/:name')
  getHelloName(@Param('name') name: string): string {
    return this.appService.getHelloName(name);
  }

  @Get('goodbye/:name')
  getGoodbyeName(@Param('name') name: string): string {
    return this.appService.getGoodbyeName(name);
  }

  @Get('health')
  getHealth(): string {
    return this.appService.getHealth();
  }
}
