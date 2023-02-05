import { Controller, Get, UseGuards, Request, Session } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt.auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/vip')
  getPremiumContent(@Request() req): string {
    console.log(req.user);
    return this.appService.getPremiumContent();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/secret')
  getSecret(): string {
    return 'А это вторая защищенная ручка!';
  }

  @UseGuards(JwtAuthGuard)
  @Get('/session')
  getSessionTest(@Session() session): void {
    console.log(session); // Странно, но аднефайн
  }
}

// TODO: Так в какой момент всё-таки становится доступен req.user (и что еще помимом него?). Я так понимаю, это и есть "сессия"?
// И почему мне ничего не отдает @Session()?
