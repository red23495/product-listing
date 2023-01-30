import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserAlreadyExistsError, InvalidCredentialError } from './auth.service';
import * as bcrypt from "bcrypt";

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signUp', () => {
    it('should throw UserAlreadyExistsError if the user already exists', async () => {
      const data = {
        username: 'test',
        password: 'test',
      };
      const previousUser = {
        id: 1,
        username: 'test',
        password: 'hashedPassword',
      };

      jest.spyOn(userService, 'findOne').mockResolvedValue(previousUser);

      await expect(authService.signUp(data)).rejects.toThrow(UserAlreadyExistsError);
    });

    it('should return the created user', async () => {
      const data = {
        username: 'test',
        password: 'test',
      };
      const hashedPassword = 'hashedPassword';

      jest.spyOn(userService, 'findOne').mockResolvedValue(null);
      // @ts-expect-error 
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(userService, 'create').mockResolvedValue({
        id: 1,
        username: 'test',
        password: hashedPassword,
      });

      const result = await authService.signUp(data);
      expect(result).toEqual({
        id: 1,
        username: 'test',
        password: hashedPassword,
      });
    });
  });
  
  describe("sign in", () => {
    const password = bcrypt.hashSync('password', 10);
    const user = {
      id: 1,
      username: 'username',
      password
    };
    it('should return an access token when given a valid credential', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      // @ts-expect-error 
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('access_token');

      const result = await authService.signIn({username: 'username', password: 'password'});
      expect(result).toEqual({access_token: 'access_token'});
    });

    it('should throw InvalidCredentialError when username is not found', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      await expect(authService.signIn({username: 'username', password: 'password'})).rejects.toThrow(InvalidCredentialError);
    });

    it('should throw InvalidCredentialError when password is incorrect', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      // @ts-expect-error 
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(authService.signIn({username: 'username', password: 'password'})).rejects.toThrow(InvalidCredentialError);
    });
  });
});