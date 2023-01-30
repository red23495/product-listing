import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignInDto, SignUpDto } from './auth.dto';
import { User } from '@prisma/client';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';

export class UserAlreadyExistsError extends Error {
  constructor(user: User) {
    super(`User with username ${user.username} already exists`);
  }
}

export class InvalidCredentialError extends Error {
  constructor() {
    super(`Provided credential is invalid`);
  }
}

@Injectable()
export class AuthService {
  
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {};

  async signUp(data: SignUpDto) {
    const username = data.username;
    const previousUser = await this.userService.findOne({username});
    if(previousUser) throw new UserAlreadyExistsError(previousUser);
    data.password = await bcrypt.hash(data.password, 10);
    return await this.userService.create(data);
  }

  async signIn({username, password}: SignInDto) {
    const user = await this.userService.findOne({username});
    if (!user) throw new InvalidCredentialError();
    if (!await bcrypt.compare(password, user.password)) {
      throw new InvalidCredentialError();
    }
    const payload = {username: user.username, sub: user.id}
    return {access_token: await this.jwtService.signAsync(payload)}
  }

}
