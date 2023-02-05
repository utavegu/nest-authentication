import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('/api/users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async registration(@Body() body: RegisterUserDto): Promise<string> {
    return this.authService.signup(body);
  }

  @Post('/signin')
  async login(@Body() body: LoginUserDto): Promise<string> {
    return this.authService.signin(body);
  }
}
