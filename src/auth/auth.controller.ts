import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.guard';
import { Post, HttpCode, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { SignInDto, SignUpDto } from './auth.dto';
import { User } from '@prisma/client';
import { UserAlreadyExistsError, InvalidCredentialError } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() data: SignUpDto) {
    let user: User;
    try {
      user = await this.authService.signUp(data);
    } catch (e) {
      if (e instanceof UserAlreadyExistsError) {
        throw new BadRequestException(e.message);
      } else throw e;
    }
    delete user.password;
    return user;
  }

  @Public()
  @Post('authenticate')
  @HttpCode(200)
  async signIn(@Body() data: SignInDto) {
    try {
      return await this.authService.signIn(data);
    } catch(e) {
      if(e instanceof InvalidCredentialError) {
        throw new NotFoundException(e.message);
      }
      else throw e;
    }
  }
}
