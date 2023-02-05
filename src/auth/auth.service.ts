import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt'; // TODO: Но вообще у Неста вроде там своя система шифрования есть, обкатай ее

import { IUser } from './interfaces/user.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  private readonly users: IUser[] = [
    {
      id: '1a42f',
      email: 'hello@test.dev',
      password: '123',
      firstName: 'User',
      lastName: 'Everlasting',
    },
    {
      id: 'ed741b',
      email: 'somemail@test.dev',
      password: 'qwerty',
      firstName: 'Som',
      lastName: 'Forelievich',
    },
  ];

  async findUser(id: IUser['id']): Promise<IUser | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async validateUser(id: IUser['id']): Promise<IUser> {
    // Лишний проброс, имхо
    const user = await this.findUser(id);
    if (user) {
      return user;
    }
    return null;
  }

  createToken(payload: any) {
    return this.jwtService.sign(payload);
  }

  // TODO: Валидацию и БД пока намеренно опускаю, так как сейчас нет на это времени, но в дипломной работе сделать всё по красоте!
  // И возвращаемые значения не строки, а JSON-объекты с полями статуса операции, мессаджем и данными

  public async signup(body: RegisterUserDto): Promise<string> {
    // Вообще я бы в роли айдишника email делал, раз он должен быть уникален.
    const isUserRegistred = this.users.find(
      (user) => user.email === body.email,
    );
    if (!isUserRegistred) {
      if (body.email && body.password) {
        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
        const password = await bcrypt.hash(body.password, salt);
        const id = Math.random().toString(36).substr(2);
        this.users.push({ id, ...body, password });
        return `Пользователь ${body.lastName} ${body.firstName} успешно зарегистрирован!`;
      } else {
        return 'Вы случайно забыли указать логин или пароль!';
      }
    } else {
      return 'Такой пользователь уже зарегистрирован в системе!';
    }
  }

  public async signin(body: LoginUserDto): Promise<string> {
    const userInDatabase = this.users.find((user) => user.email === body.email);
    if (userInDatabase) {
      const isValidPassword = await bcrypt.compare(
        body.password,
        userInDatabase.password,
      );
      if (isValidPassword) {
        const token = this.createToken({
          id: userInDatabase.id,
          email: userInDatabase.email,
          firstName: userInDatabase.firstName,
        });
        return `
        Добро пожаловать ${userInDatabase.lastName} ${userInDatabase.firstName}!, вот ваш токен доступа: ${token}
        `;
      } else {
        return 'Неверный пароль!';
      }
    } else {
      return 'Такой пользователь не зарегистрирован!';
    }
  }
}
