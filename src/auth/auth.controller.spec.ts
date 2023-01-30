import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UserAlreadyExistsError, InvalidCredentialError } from './auth.service';
import { SignInDto, SignUpDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from "bcrypt";

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn()
          }
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token')
          }
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  describe('signUp', () => {
    it('should return user object with password removed', async () => {
      const user = { id: 1, username: 'testuser', password: 'secret' };
      jest.spyOn(authService, 'signUp').mockResolvedValue(user);

      expect(await controller.signUp({ username: 'testuser', password: 'secret' })).toEqual({ id: 1, username: 'testuser' });
    });

    it('should throw BadRequestException with user already exists message', async () => {
      jest.spyOn(authService, 'signUp').mockRejectedValue(new UserAlreadyExistsError({ id: 1, username: 'testuser', password: 'secret' }));

      await expect(controller.signUp({ username: 'testuser', password: 'secret' })).rejects.toThrow(BadRequestException);
      await expect(controller.signUp({ username: 'testuser', password: 'secret' })).rejects.toThrow('User with username testuser already exists');
    });

    it('should throw an error if there is a problem during sign up', async () => {
      jest.spyOn(authService, 'signUp').mockRejectedValue(new Error('An error occurred'));

      await expect(controller.signUp({ username: 'testuser', password: 'secret' })).rejects.toThrow(Error);
      await expect(controller.signUp({ username: 'testuser', password: 'secret' })).rejects.toThrow('An error occurred');
    });
  });

  describe('Sign In', () => {
    it('should return access_token on successful sign in', async () => {
      const data: SignInDto = { username: 'test', password: 'test' };
      // @ts-expect-error 
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(userService, 'findOne').mockResolvedValue({ id: 1, username: 'test', password: 'test' });
      const result = await controller.signIn(data);
      expect(result.access_token).toBeDefined();
    });

    it('should throw NotFoundException on invalid credentials', async () => {
      jest.spyOn(authService, 'signIn').mockRejectedValue(new InvalidCredentialError());
      const data: SignInDto = { username: 'test', password: 'test' };
      await expect(controller.signIn(data)).rejects.toThrow(NotFoundException);
    });
  })
});