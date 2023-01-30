import { MinLength } from "class-validator";

export class SignUpDto {

  username: string;

  @MinLength(8)
  password: string;

}

export class SignInDto {

  username: string;

  @MinLength(8)
  password: string;

}