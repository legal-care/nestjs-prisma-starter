import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHelloName(name: string): string {
    return `Hello ${name}!!!!`;
  }

  getGoodbyeName(name: string): string {
    return `Goodbye ${name}!!!!`;
  }

  getHealth(): string {
    return 'ok';
  }
}
