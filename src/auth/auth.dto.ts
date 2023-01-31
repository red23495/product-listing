import { ApiProperty } from "@nestjs/swagger";
import { MinLength } from "class-validator";

export class SignUpDto {

  @ApiProperty()
  username: string;

  @MinLength(8)
  @ApiProperty()
  password: string;

}

export class SignInDto {

  @ApiProperty()
  username: string;

  @ApiProperty()
  @MinLength(8)
  password: string;

}