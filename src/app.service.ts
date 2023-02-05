import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getPremiumContent(): string {
    return 'This is is secret message!';
  }
}
