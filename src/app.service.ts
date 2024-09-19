import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHelloName(name: string): string {
    console.log(`[app/service] hello ${name}`);
    return `Hello ${name}!!!!`;
  }

  getGoodbyeName(name: string): string {
    console.log(`[app/service] goodbye ${name}`);
    return `Goodbye ${name}!!!!`;
  }

  getHealth(): string {
    return 'ok';
  }
}
